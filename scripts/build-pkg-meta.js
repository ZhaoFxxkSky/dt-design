const fs = require('fs');
const path = require('path');

const root = process.cwd();

const metaFiles = [
  { dir: 'esm', type: 'module' },
  { dir: 'lib', type: 'commonjs' },
];

for (const { dir, type } of metaFiles) {
  const targetDir = path.join(root, dir);
  if (fs.existsSync(targetDir)) {
    fs.writeFileSync(
      path.join(targetDir, 'package.json'),
      JSON.stringify({ type }, null, 2) + '\n',
    );
    console.log(`Created ${dir}/package.json with type "${type}"`);
  }
}
