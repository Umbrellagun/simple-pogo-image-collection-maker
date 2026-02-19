#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { createInterface } from 'readline';

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function parseVersion(version) {
  const [major, minor, patch] = version.split('.').map(Number);
  return { major, minor, patch };
}

function formatVersion({ major, minor, patch }) {
  return `${major}.${minor}.${patch}`;
}

function bumpVersion(version, type) {
  const { major, minor, patch } = parseVersion(version);
  
  switch (type) {
    case 'major':
      return formatVersion({ major: major + 1, minor: 0, patch: 0 });
    case 'minor':
      return formatVersion({ major, minor: minor + 1, patch: 0 });
    case 'patch':
      return formatVersion({ major, minor, patch: patch + 1 });
    default:
      throw new Error(`Invalid version type: ${type}`);
  }
}

async function main() {
  try {
    // Read current package.json
    const packagePath = './package.json';
    const packageJson = JSON.parse(readFileSync(packagePath, 'utf-8'));
    const currentVersion = packageJson.version;
    
    console.log('\n📦 Version Bump Tool');
    console.log('═══════════════════════════════════════');
    console.log(`Current version: v${currentVersion}`);
    console.log('');
    console.log('Select version increment:');
    console.log(`  1. Patch  (v${currentVersion} → v${bumpVersion(currentVersion, 'patch')}) - Bug fixes`);
    console.log(`  2. Minor  (v${currentVersion} → v${bumpVersion(currentVersion, 'minor')}) - New features`);
    console.log(`  3. Major  (v${currentVersion} → v${bumpVersion(currentVersion, 'major')}) - Breaking changes`);
    console.log(`  4. Skip   - Don't change version`);
    console.log('');
    
    const choice = await question('Enter choice (1-4): ');
    
    let newVersion;
    let versionType;
    
    switch (choice.trim()) {
      case '1':
        versionType = 'patch';
        newVersion = bumpVersion(currentVersion, 'patch');
        break;
      case '2':
        versionType = 'minor';
        newVersion = bumpVersion(currentVersion, 'minor');
        break;
      case '3':
        versionType = 'major';
        newVersion = bumpVersion(currentVersion, 'major');
        break;
      case '4':
        console.log('\n⏭️  Skipping version bump');
        rl.close();
        process.exit(0);
        return;
      default:
        console.log('\n❌ Invalid choice. Aborting.');
        rl.close();
        process.exit(1);
        return;
    }
    
    // Update package.json
    packageJson.version = newVersion;
    writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');
    
    console.log('');
    console.log(`✅ Version bumped: v${currentVersion} → v${newVersion} (${versionType})`);
    console.log('');
    
    rl.close();
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    rl.close();
    process.exit(1);
  }
}

main();
