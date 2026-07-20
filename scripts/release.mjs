/**
 * Tag the current package version and push the tag to origin.
 *
 * Usage: npm run release
 */
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const { version } = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf-8'));

execSync(`git tag v${version} && git push origin v${version}`, { stdio: 'inherit' });
