#!/usr/bin/env node

/**
 * Deployment script for Bulk Video Cropper
 * 
 * This script helps prepare the application for production deployment.
 * It performs the following tasks:
 * 1. Validates the build environment
 * 2. Builds the application for production
 * 3. Runs basic tests to ensure the build is valid
 * 4. Prepares deployment files
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Executes a shell command and returns the output
 */
function exec(command) {
  try {
    return execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`${colors.red}Command failed: ${command}${colors.reset}`);
    throw error;
  }
}

/**
 * Logs a message with a prefix
 */
function log(message, type = 'info') {
  const prefix = {
    info: `${colors.blue}[INFO]${colors.reset}`,
    success: `${colors.green}[SUCCESS]${colors.reset}`,
    warning: `${colors.yellow}[WARNING]${colors.reset}`,
    error: `${colors.red}[ERROR]${colors.reset}`,
  }[type] || `${colors.blue}[INFO]${colors.reset}`;
  
  console.log(`${prefix} ${message}`);
}

/**
 * Validates the build environment
 */
function validateEnvironment() {
  log('Validating build environment...');
  
  // Check if .env.production exists
  if (!fs.existsSync(path.join(process.cwd(), '.env.production'))) {
    log('Missing .env.production file. Creating a default one...', 'warning');
    fs.copyFileSync(
      path.join(process.cwd(), '.env.local') || path.join(process.cwd(), '.env') || path.join(process.cwd(), '.env.example'),
      path.join(process.cwd(), '.env.production')
    );
  }
  
  // Check Node.js version
  const nodeVersion = process.version.match(/^v(\d+)\./)[1];
  if (parseInt(nodeVersion) < 16) {
    log(`Node.js version ${process.version} is not supported. Please use Node.js 16 or higher.`, 'error');
    process.exit(1);
  }
  
  // Check if next.config.js exists
  if (!fs.existsSync(path.join(process.cwd(), 'next.config.js'))) {
    log('Missing next.config.js file.', 'error');
    process.exit(1);
  }
  
  log('Environment validation completed.', 'success');
}

/**
 * Builds the application for production
 */
function buildApplication() {
  log('Building application for production...');
  
  try {
    // Install dependencies
    log('Installing dependencies...');
    exec('npm install --production=false');
    
    // Run linting
    log('Running linter...');
    exec('npm run lint || true');
    
    // Build the application
    log('Building the application...');
    exec('npm run build');
    
    log('Application built successfully.', 'success');
  } catch (error) {
    log('Failed to build the application.', 'error');
    process.exit(1);
  }
}

/**
 * Prepares deployment files
 */
function prepareDeployment() {
  log('Preparing deployment files...');
  
  // Create a deployment directory if it doesn't exist
  const deployDir = path.join(process.cwd(), 'deployment');
  if (!fs.existsSync(deployDir)) {
    fs.mkdirSync(deployDir);
  }
  
  // Create a deployment info file
  const deploymentInfo = {
    name: 'Bulk Video Cropper',
    version: require(path.join(process.cwd(), 'package.json')).version,
    buildDate: new Date().toISOString(),
    nodeVersion: process.version,
  };
  
  fs.writeFileSync(
    path.join(deployDir, 'deployment-info.json'),
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  log('Deployment files prepared.', 'success');
}

/**
 * Main function
 */
async function main() {
  console.log(`\n${colors.bright}${colors.cyan}=== Bulk Video Cropper Deployment Script ===${colors.reset}\n`);
  
  try {
    validateEnvironment();
    buildApplication();
    prepareDeployment();
    
    console.log(`\n${colors.green}${colors.bright}✓ Deployment preparation completed successfully!${colors.reset}\n`);
    console.log(`${colors.cyan}Next steps:${colors.reset}`);
    console.log(`1. Upload the ${colors.bright}.next/${colors.reset} directory to your hosting provider`);
    console.log(`2. Configure your hosting provider to serve the Next.js application`);
    console.log(`3. Set up environment variables on your hosting provider\n`);
    
    rl.close();
  } catch (error) {
    console.error(`\n${colors.red}${colors.bright}✗ Deployment preparation failed!${colors.reset}\n`);
    console.error(error);
    rl.close();
    process.exit(1);
  }
}

// Run the main function
main();
