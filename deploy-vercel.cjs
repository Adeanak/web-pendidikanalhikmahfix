#!/usr/bin/env node

/**
 * Vercel Deployment Script
 * Automates the deployment process to Vercel
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Vercel deployment process...');

// Check if vercel.json exists
if (!fs.existsSync('vercel.json')) {
  console.error('❌ vercel.json not found. Please ensure Vercel configuration exists.');
  process.exit(1);
}

// Check if .env file exists
if (!fs.existsSync('.env')) {
  console.warn('⚠️  .env file not found. Make sure to set environment variables in Vercel dashboard.');
}

try {
  // Clean previous build
  console.log('🧹 Cleaning previous build...');
  if (fs.existsSync('dist')) {
    execSync('rmdir /s /q dist', { stdio: 'inherit' });
  }

  // Install dependencies
  console.log('📦 Installing dependencies...');
  execSync('npm ci', { stdio: 'inherit' });

  // Run build
  console.log('🔨 Building application...');
  execSync('npm run build', { stdio: 'inherit' });

  // Check if Vercel CLI is installed
  try {
    execSync('vercel --version', { stdio: 'pipe' });
  } catch (error) {
    console.log('📥 Installing Vercel CLI...');
    execSync('npm install -g vercel', { stdio: 'inherit' });
  }

  // Deploy to Vercel
  console.log('🚀 Deploying to Vercel...');
  const deployCommand = process.argv.includes('--prod') ? 'vercel --prod' : 'vercel';
  execSync(deployCommand, { stdio: 'inherit' });

  console.log('✅ Deployment completed successfully!');
  console.log('🌐 Your application is now live on Vercel!');

} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
}