/**
 * Batch replace imports in rc-table source files.
 * 
 * Replaces:
 * 1. @rc-component/context → ../rcContext (relative path adjusted per file depth)
 * 2. @rc-component/util → rc-util/es subpath imports
 * 3. @rc-component/resize-observer → rc-resize-observer
 * 4. @rc-component/virtual-list → rc-virtual-list
 * 5. rc-table prefix → dt-table prefix
 */

const fs = require('fs');
const path = require('path');

const CORE_DIR = path.join(__dirname, '..', 'components', 'table', 'core');

// Map of @rc-component/util function names to rc-util subpaths
const utilFunctionMap = {
  'get': 'rc-util/es/get',
  'useEvent': 'rc-util/es/hooks/useEvent',
  'warning': 'rc-util/es/warning',
  'getDOM': 'rc-util/es/Dom/findDOMNode',
  'getScrollBarSize': 'rc-util/es/getScrollBarSize',
  'getTargetScrollBarSize': 'rc-util/es/getScrollBarSize',
  'raf': 'rc-util/es/raf',
  'isEqual': 'rc-util/es/isEqual',
  'useMemo': 'rc-util/es/hooks/useMemo',
  'toArray': 'rc-util/es/Children/toArray',
  'isVisible': 'rc-util/es/Dom/isVisible',
  'useLayoutEffect': 'rc-util/es/hooks/useLayoutEffect',
  'useLayoutUpdateEffect': 'rc-util/es/hooks/useLayoutEffect',
  'fillRef': 'rc-util/es/ref',
  'composeRef': 'rc-util/es/ref',
  'supportRef': 'rc-util/es/ref',
  'supportNodeRef': 'rc-util/es/ref',
  'getNodeRef': 'rc-util/es/ref',
  'useComposeRef': 'rc-util/es/ref',
  'pickAttrs': 'rc-util/es/pickAttrs',
  'noteOnce': 'rc-util/es/warning',
  'resetWarned': 'rc-util/es/warning',
  'set': 'rc-util/es/set',
  'merge': 'rc-util/es/set',
  'mergeWith': 'rc-util/es/set',
  'useMergedState': 'rc-util/es/hooks/useMergedState',
  'useId': 'rc-util/es/hooks/useId',
  'getId': 'rc-util/es/hooks/useId',
  'useState': 'rc-util/es/hooks/useState',
  'useSyncState': 'rc-util/es/hooks/useSyncState',
  'canUseDom': 'rc-util/es/Dom/canUseDom',
  'omit': 'rc-util/es/omit',
  'isMobile': 'rc-util/es/isMobile',
  'KeyCode': 'rc-util/es/KeyCode',
};

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

function getRelativeRcContextPath(filePath) {
  const dir = path.dirname(filePath);
  const rcContextDir = path.join(CORE_DIR, 'rcContext');
  let relative = path.relative(dir, rcContextDir).replace(/\\/g, '/');
  if (!relative.startsWith('.')) {
    relative = `./${relative}`;
  }
  return relative;
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // 1. Replace @rc-component/context imports
  // Pattern: import { X, Y } from '@rc-component/context';
  const contextImportRegex = /import\s+\{([^}]+)\}\s+from\s+'@rc-component\/context'/g;
  const contextMatch = content.match(contextImportRegex);
  if (contextMatch) {
    const rcContextPath = getRelativeRcContextPath(filePath);
    content = content.replace(contextImportRegex, (_match, imports) => {
      return `import { ${imports.trim()} } from '${rcContextPath}'`;
    });
    modified = true;
  }

  // 2. Replace @rc-component/util imports
  // This is more complex because different functions come from different subpaths
  const utilImportRegex = /import\s+\{([^}]+)\}\s+from\s+'@rc-component\/util'/g;
  const utilMatch = content.match(utilImportRegex);
  if (utilMatch) {
    content = content.replace(utilImportRegex, (_match, importsStr) => {
      const imports = importsStr.split(',').map(s => {
        const parts = s.trim().split(/\s+as\s+/);
        const funcName = parts[0].trim();
        const alias = parts[1]?.trim();
        return { funcName, alias, raw: s.trim() };
      });

      // Group by target module path
      const groups = {};
      for (const imp of imports) {
        const targetPath = utilFunctionMap[imp.funcName];
        if (!targetPath) {
          console.error(`  UNKNOWN function: ${imp.funcName} in ${filePath}`);
          continue;
        }
        if (!groups[targetPath]) {
          groups[targetPath] = [];
        }
        if (imp.alias) {
          groups[targetPath].push(`${imp.funcName} as ${imp.alias}`);
        } else {
          groups[targetPath].push(imp.funcName);
        }
      }

      // Generate import statements
      const importStatements = Object.entries(groups).map(([modulePath, funcs]) => {
        return `import { ${funcs.join(', ')} } from '${modulePath}'`;
      });

      return importStatements.join('\n');
    });
    modified = true;
  }

  // 3. Replace @rc-component/resize-observer
  if (content.includes('@rc-component/resize-observer')) {
    content = content.replace(/@rc-component\/resize-observer/g, 'rc-resize-observer');
    modified = true;
  }

  // 4. Replace @rc-component/virtual-list
  if (content.includes('@rc-component/virtual-list')) {
    content = content.replace(/@rc-component\/virtual-list/g, 'rc-virtual-list');
    modified = true;
  }

  // 5. Replace DEFAULT_PREFIX from 'rc-table' to 'dt-table'
  if (content.includes("'rc-table'") || content.includes('"rc-table"')) {
    content = content.replace(/'rc-table'/g, "'dt-table'");
    content = content.replace(/"rc-table"/g, "'dt-table'");
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  Modified: ${path.relative(CORE_DIR, filePath)}`);
  }

  return modified;
}

console.log('Processing files in:', CORE_DIR);
const files = getAllFiles(CORE_DIR);
console.log(`Found ${files.length} files`);

let modifiedCount = 0;
for (const file of files) {
  if (processFile(file)) {
    modifiedCount++;
  }
}

console.log(`\nDone! Modified ${modifiedCount} files.`);
