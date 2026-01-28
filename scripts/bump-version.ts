#!/usr/bin/env ts-node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

type BumpType = 'major' | 'minor' | 'patch';

const args = process.argv.slice(2);
const bump: BumpType = args[0] as BumpType;

if (!bump || !['major', 'minor', 'patch'].includes(bump)) {
  console.error('Usage: pnpm increment-version {major|minor|patch}');
  process.exit(1);
}

// Paths
const versionPath = path.resolve(process.cwd(), 'version.json');
const packagePath = path.resolve(process.cwd(), 'package.json');

// Read current version from version.json
const versionData = JSON.parse(fs.readFileSync(versionPath, 'utf-8'));
const [major, minor, patch] = versionData.version.split('.').map(Number);

// Compute new version
let newVersion: string;
switch (bump) {
  case 'major':
    newVersion = `${major + 1}.0.0`;
    break;
  case 'minor':
    newVersion = `${major}.${minor + 1}.0`;
    break;
  case 'patch':
    newVersion = `${major}.${minor}.${patch + 1}`;
    break;
}

console.log(`Bumping version: ${versionData.version} → ${newVersion}`);

// Update version.json
versionData.version = newVersion;
fs.writeFileSync(versionPath, JSON.stringify(versionData, null, 2) + '\n');

// Update package.json
const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
packageData.version = newVersion;
fs.writeFileSync(packagePath, JSON.stringify(packageData, null, 2) + '\n');

console.log('Updated version.json and package.json');

// Create Git commit and tag
try {
  execSync('git add version.json package.json', { stdio: 'inherit' });
  execSync(`git commit -m "chore: bump version to ${newVersion}"`, { stdio: 'inherit' });
  execSync(`git tag v${newVersion}`, { stdio: 'inherit' });
  console.log(`Git commit and tag created: v${newVersion}`);
} catch (err) {
  console.error('Git commit or tag failed. Make sure you have changes staged and Git initialized.');
  process.exit(1);
}
