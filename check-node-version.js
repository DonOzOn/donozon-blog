#!/usr/bin/env node

const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

console.log(`Current Node.js version: ${nodeVersion}`);
console.log(`Required for Next.js 15: Node.js 18+`);

if (majorVersion >= 18) {
  console.log('✅ Node.js version is compatible!');
  process.exit(0);
} else {
  console.log('❌ Node.js version is too old!');
  console.log('\nTo fix this issue:');
  console.log('1. Install nvm (Node Version Manager):');
  console.log('   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash');
  console.log('2. Restart your terminal');
  console.log('3. Install and use Node.js 18:');
  console.log('   nvm install 18');
  console.log('   nvm use 18');
  console.log('4. Try running your project again');
  process.exit(1);
}