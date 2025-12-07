#!/usr/bin/env node

/**
 * Build script for Command Center Dashboard
 */

const fs = require('fs-extra');
const path = require('path');

const BUILD_DIR = 'dist';
const PUBLIC_DIR = 'public';
const SRC_DIR = 'src';

async function build() {
  console.log('🚀 Starting build process...');
  
  try {
    // Clean build directory
    await fs.emptyDir(BUILD_DIR);
    console.log('✓ Cleaned build directory');
    
    // Copy public files
    if (await fs.pathExists(PUBLIC_DIR)) {
      await fs.copy(PUBLIC_DIR, BUILD_DIR);
      console.log('✓ Copied public files');
    }
    
    // Copy source files
    await fs.copy(SRC_DIR, path.join(BUILD_DIR, 'src'));
    console.log('✓ Copied source files');
    
    // Copy package.json if exists
    if (await fs.pathExists('package.json')) {
      await fs.copy('package.json', path.join(BUILD_DIR, 'package.json'));
      console.log('✓ Copied package.json');
    }
    
    // Copy README.md if exists
    if (await fs.pathExists('README.md')) {
      await fs.copy('README.md', path.join(BUILD_DIR, 'README.md'));
      console.log('✓ Copied README.md');
    }
    
    // Create .nojekyll file for GitHub Pages
    await fs.writeFile(path.join(BUILD_DIR, '.nojekyll'), '');
    console.log('✓ Created .nojekyll file');
    
    // Create CNAME file if exists
    if (await fs.pathExists('CNAME')) {
      await fs.copy('CNAME', path.join(BUILD_DIR, 'CNAME'));
      console.log('✓ Copied CNAME');
    }
    
    // Update data path in index.html
    const indexPath = path.join(BUILD_DIR, 'index.html');
    if (await fs.pathExists(indexPath)) {
      let html = await fs.readFile(indexPath, 'utf8');
      
      // Update data path for production
      html = html.replace('../src/data/', 'src/data/');
      html = html.replace('../src/css/', 'src/css/');
      html = html.replace('../src/js/', 'src/js/');
      
      await fs.writeFile(indexPath, html);
      console.log('✓ Updated index.html paths');
    }
    
    console.log('✅ Build completed successfully!');
    console.log(`📁 Output directory: ${BUILD_DIR}`);
    
    // Show build stats
    const files = await fs.readdir(BUILD_DIR);
    console.log(`📊 Build contains ${files.length} files/directories`);
    
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

// Run build
build();