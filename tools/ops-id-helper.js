#!/usr/bin/env node

/**
 * Ops ID Helper
 *
 * Reports repository structure for ops reference.
 * This is a reporting tool only - no validation, no enforcement.
 * Always exits with code 0.
 */

const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');

function getChapters() {
  const entries = fs.readdirSync(repoRoot, { withFileTypes: true });
  return entries
    .filter(e => e.isDirectory() && /^Chapter\d{2}-/.test(e.name))
    .map(e => e.name)
    .sort();
}

function checkMetadataFiles() {
  const chapters = getChapters();
  const metadataFiles = [];

  for (const chapter of chapters) {
    const metaPath = path.join(repoRoot, chapter, 'ops-meta.json');
    if (fs.existsSync(metaPath)) {
      metadataFiles.push(path.join(chapter, 'ops-meta.json'));
    }
  }

  return metadataFiles;
}

function main() {
  console.log('Ops ID Helper\n');

  const chapters = getChapters();
  console.log(`Chapters found: ${chapters.length}`);
  for (const chapter of chapters) {
    console.log(`- ${chapter}`);
  }

  console.log();

  const metadataFiles = checkMetadataFiles();
  if (metadataFiles.length === 0) {
    console.log('Optional metadata files: none present');
  } else {
    console.log(`Optional metadata files: ${metadataFiles.length} found`);
    for (const file of metadataFiles) {
      console.log(`- ${file}`);
    }
  }

  console.log('\nDone.');
}

main();
process.exit(0);
