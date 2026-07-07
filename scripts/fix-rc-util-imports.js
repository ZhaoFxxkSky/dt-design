/**
 * Fix rc-util imports: change named imports to default imports
 * 
 * rc-util v5 uses `export default` for most functions in subpath modules.
 * So `import { useEvent } from 'rc-util/es/hooks/useEvent'` 
 * should be `import useEvent from 'rc-util/es/hooks/useEvent'`
 */

const fs = require('fs');
const path = require('path');

const CORE_DIR = path.join(__dirname, '..', 'components', 'table', 'core');

// These rc-util subpath modules use `export default`, so we need default import
const defaultExportModules = new Set([
  'rc-util/es/hooks/useEvent',
  'rc-util/es/hooks/useLayoutEffect',
  'rc-util/es/hooks/useMemo',
  'rc-util/es/hooks/useMergedState',
  'rc-util/es/hooks/useId',
  'rc-util/es/hooks/useState',
  'rc-util/es/hooks/useSyncState',
  'rc-util/es/isEqual',
  'rc-util/es/warning',
  'rc-util/es/raf',
  'rc-util/es/Dom/canUseDom',
  'rc-util/es/Dom/isVisible',
  'rc-util/es/Dom/findDOMNode',  // has named export getDOM
  'rc-util/es/getScrollBarSize',  // has named export getTargetScrollBarSize
  'rc-util/es/ref',               // has named exports
  'rc-util/es/pickAttrs',
  'rc-util/es/Children/toArray',
  'rc-util/es/get',
  'rc-util/es/omit',
  'rc-util/es/isMobile',
  'rc-util/es/KeyCode',
]);

function getAllFiles(dir, ext = ['.ts', '.tsx']) {
  const results = [];
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results.push(...getAllFiles(fullPath, ext));
    } else if (ext.includes(path.extname(fullPath))) {
      results.push(fullPath);
    }
  }
  return results;
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  const lines = content.split('\n');
  const newLines = [];
  
  for (const line of lines) {
    // Match: import { X } from 'rc-util/es/...';
    // or: import { X as Y } from 'rc-util/es/...';
    const importMatch = line.match(/^import\s+\{([^}]+)\}\s+from\s+'(rc-util\/es\/[^']+)'/);
    if (importMatch) {
      const importsStr = importMatch[1].trim();
      const modulePath = importMatch[2];
      
      // Parse imports
      const imports = importsStr.split(',').map(s => {
        const parts = s.trim().split(/\s+as\s+/);
        return { name: parts[0].trim(), alias: parts[1]?.trim() };
      }).filter(i => i.name);
      
      // Check if this module uses default export
      // For modules like findDOMNode, getScrollBarSize, ref - they have BOTH default and named exports
      // For others - only default export
      
      if (modulePath === 'rc-util/es/Dom/findDOMNode') {
        // findDOMNode has: export function getDOM, export default findDOMNode
        // We want getDOM as named import
        newLines.push(line);
        continue;
      }
      
      if (modulePath === 'rc-util/es/getScrollBarSize') {
        // getScrollBarSize has: export default getScrollBarSize, export function getTargetScrollBarSize
        // getScrollBarSize -> default import, getTargetScrollBarSize -> named import
        const namedImports = imports.filter(i => i.name !== 'getScrollBarSize');
        const hasDefault = imports.some(i => i.name === 'getScrollBarSize');
        
        const resultLines = [];
        if (hasDefault) {
          const defaultImport = imports.find(i => i.name === 'getScrollBarSize');
          if (defaultImport.alias) {
            resultLines.push(`import ${defaultImport.alias} from '${modulePath}';`);
          } else {
            resultLines.push(`import getScrollBarSize from '${modulePath}';`);
          }
        }
        if (namedImports.length > 0) {
          const namedStr = namedImports.map(i => i.alias ? `${i.name} as ${i.alias}` : i.name).join(', ');
          resultLines.push(`import { ${namedStr} } from '${modulePath}';`);
        }
        newLines.push(...resultLines);
        modified = true;
        continue;
      }
      
      if (modulePath === 'rc-util/es/ref') {
        // ref.ts has named exports: fillRef, composeRef, supportRef, supportNodeRef, getNodeRef, useComposeRef
        // Keep as named import
        newLines.push(line);
        continue;
      }
      
      // For all other modules with default export
      if (defaultExportModules.has(modulePath)) {
        if (imports.length === 1) {
          // Single import - convert to default import
          const imp = imports[0];
          if (imp.alias) {
            newLines.push(`import ${imp.alias} from '${modulePath}';`);
          } else {
            newLines.push(`import ${imp.name} from '${modulePath}';`);
          }
          modified = true;
          continue;
        } else {
          // Multiple imports from same module - split into separate lines
          for (const imp of imports) {
            if (imp.alias) {
              newLines.push(`import ${imp.alias} from '${modulePath}';`);
            } else {
              newLines.push(`import ${imp.name} from '${modulePath}';`);
            }
          }
          modified = true;
          continue;
        }
      }
      
      // Unknown module - keep as is
      newLines.push(line);
    } else {
      newLines.push(line);
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, newLines.join('\n'), 'utf8');
    console.log(`  Fixed: ${path.relative(CORE_DIR, filePath)}`);
  }
  
  return modified;
}

console.log('Fixing rc-util imports in:', CORE_DIR);
const files = getAllFiles(CORE_DIR);
console.log(`Found ${files.length} files`);

let fixedCount = 0;
for (const file of files) {
  if (processFile(file)) {
    fixedCount++;
  }
}

console.log(`\nDone! Fixed ${fixedCount} files.`);
