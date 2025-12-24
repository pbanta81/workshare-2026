#!/usr/bin/env node
/**
 * Password Hash Generator
 * 
 * Run: node scripts/generate-hash.mjs "your-password-here"
 * 
 * Copy the output hash and add it to Vercel Environment Variables:
 * PORTFOLIO_1_HASH=<the hash>
 * PORTFOLIO_1_URL=https://your-redirect-url.com
 */

import { createHash } from 'crypto';

const password = process.argv[2];

if (!password) {
  console.log('\n🔐 Password Hash Generator\n');
  console.log('Usage: node scripts/generate-hash.mjs "your-password"');
  console.log('\nExample:');
  console.log('  node scripts/generate-hash.mjs "secretpass123"');
  console.log('\nThen add to Vercel Environment Variables:');
  console.log('  PORTFOLIO_1_HASH=<generated-hash>');
  console.log('  PORTFOLIO_1_URL=https://your-portfolio-url.com');
  process.exit(1);
}

const hash = createHash('sha256').update(password).digest('hex');

console.log('\n🔐 Password Hash Generator\n');
console.log('Password:', password);
console.log('SHA-256 Hash:', hash);
console.log('\n📋 Add these to Vercel Environment Variables:');
console.log(`  PORTFOLIO_X_HASH=${hash}`);
console.log('  PORTFOLIO_X_URL=https://your-redirect-url.com');
console.log('\n(Replace X with 1, 2, 3, etc. for multiple passwords)\n');

