#!/usr/bin/env node

/**
 * Script otomatis untuk memperbaiki deployment Vercel
 * Mengatasi error 404 DEPLOYMENT_NOT_FOUND
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    log(`✅ ${description} ditemukan`, 'green');
    return true;
  } else {
    log(`❌ ${description} tidak ditemukan: ${filePath}`, 'red');
    return false;
  }
}

function runCommand(command, description) {
  try {
    log(`🔄 ${description}...`, 'blue');
    const output = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
    log(`✅ ${description} berhasil`, 'green');
    return { success: true, output };
  } catch (error) {
    log(`❌ ${description} gagal: ${error.message}`, 'red');
    return { success: false, error: error.message };
  }
}

function main() {
  log('🚀 Memulai perbaikan deployment Vercel...', 'cyan');
  log('=' .repeat(50), 'cyan');

  // 1. Cek file-file penting
  log('\n📋 Memeriksa file-file penting...', 'yellow');
  const files = [
    { path: 'package.json', desc: 'Package.json' },
    { path: 'vercel.json', desc: 'Vercel config' },
    { path: 'dist/index.html', desc: 'Build output' },
    { path: '.env.example', desc: 'Environment example' }
  ];

  let allFilesExist = true;
  files.forEach(file => {
    if (!checkFile(file.path, file.desc)) {
      allFilesExist = false;
    }
  });

  if (!allFilesExist) {
    log('\n❌ Beberapa file penting hilang. Periksa struktur project!', 'red');
    return;
  }

  // 2. Cek environment variables
  log('\n🔧 Memeriksa environment variables...', 'yellow');
  const envExample = fs.readFileSync('.env.example', 'utf8');
  const requiredEnvs = envExample.match(/VITE_\w+=/g) || [];
  
  log('Environment variables yang diperlukan:', 'blue');
  requiredEnvs.forEach(env => {
    log(`  - ${env.replace('=', '')}`, 'cyan');
  });

  // 3. Clean build
  log('\n🧹 Membersihkan build lama...', 'yellow');
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
    log('✅ Folder dist dihapus', 'green');
  }

  // 4. Install dependencies
  log('\n📦 Menginstall dependencies...', 'yellow');
  const installResult = runCommand('npm install', 'Install dependencies');
  if (!installResult.success) {
    log('❌ Gagal install dependencies. Coba manual: npm install', 'red');
    return;
  }

  // 5. Build project
  log('\n🔨 Building project...', 'yellow');
  const buildResult = runCommand('npm run build', 'Build project');
  if (!buildResult.success) {
    log('❌ Build gagal. Periksa error di atas!', 'red');
    return;
  }

  // 6. Verifikasi build output
  log('\n✅ Memverifikasi build output...', 'yellow');
  if (!checkFile('dist/index.html', 'Build output index.html')) {
    log('❌ Build tidak menghasilkan file yang benar!', 'red');
    return;
  }

  // 7. Cek Vercel CLI
  log('\n🔍 Memeriksa Vercel CLI...', 'yellow');
  const vercelCheck = runCommand('vercel --version', 'Cek Vercel CLI');
  
  if (!vercelCheck.success) {
    log('⚠️  Vercel CLI tidak terinstall. Install dengan:', 'yellow');
    log('   npm i -g vercel', 'cyan');
    log('\n📋 Langkah manual deployment:', 'blue');
    log('1. Install Vercel CLI: npm i -g vercel', 'cyan');
    log('2. Login: vercel login', 'cyan');
    log('3. Deploy: vercel --prod', 'cyan');
  } else {
    log('✅ Vercel CLI tersedia', 'green');
    
    // 8. Deploy ke Vercel
    log('\n🚀 Deploying ke Vercel...', 'yellow');
    log('⚠️  Pastikan environment variables sudah diset di Vercel Dashboard!', 'yellow');
    
    const deployResult = runCommand('vercel --prod --yes', 'Deploy to Vercel');
    if (deployResult.success) {
      log('\n🎉 Deployment berhasil!', 'green');
      log('🔗 Cek hasil di: https://web-pendidikanalhikmah.vercel.app', 'cyan');
    } else {
      log('\n❌ Deployment gagal. Coba manual deployment:', 'red');
      log('1. vercel login', 'cyan');
      log('2. vercel --prod', 'cyan');
    }
  }

  // 9. Panduan environment variables
  log('\n📝 PENTING - Environment Variables di Vercel:', 'yellow');
  log('1. Buka https://vercel.com/dashboard', 'cyan');
  log('2. Pilih project → Settings → Environment Variables', 'cyan');
  log('3. Tambahkan semua VITE_ variables dari .env.example', 'cyan');
  log('4. Redeploy jika diperlukan', 'cyan');

  log('\n✅ Script selesai! Cek panduan lengkap di VERCEL-404-FIX.md', 'green');
  log('=' .repeat(50), 'cyan');
}

if (require.main === module) {
  main();
}

module.exports = { main };