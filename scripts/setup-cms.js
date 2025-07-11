#!/usr/bin/env node

/**
 * VALIPOKKANN CMS Setup Script
 * 
 * This script helps set up the GitHub OAuth for the CMS.
 * 
 * Steps to complete the setup:
 * 
 * 1. Create a GitHub OAuth App:
 *    - Go to https://github.com/settings/developers
 *    - Click "New OAuth App"
 *    - Application name: "VALIPOKKANN CMS"
 *    - Homepage URL: https://valipokkann.com
 *    - Authorization callback URL: https://valipokkann.com/admin/auth-callback.html
 * 
 * 2. Get your Client ID and update the auth.html file
 * 
 * 3. Set up GitHub Pages to serve the admin interface
 */

console.log('🚀 VALIPOKKANN CMS Setup');
console.log('========================\n');

console.log('📋 Setup Steps:');
console.log('1. Create GitHub OAuth App:');
console.log('   - Visit: https://github.com/settings/developers');
console.log('   - Click "New OAuth App"');
console.log('   - Application name: "VALIPOKKANN CMS"');
console.log('   - Homepage URL: https://valipokkann.com');
console.log('   - Authorization callback URL: https://valipokkann.com/admin/auth-callback.html\n');

console.log('2. After creating the OAuth app, you\'ll get a Client ID');
console.log('3. Update the auth.html file with your Client ID\n');

console.log('📁 Files created/modified:');
console.log('✅ public/admin/config.yml - Updated for GitHub backend');
console.log('✅ public/admin/index.html - Updated CMS interface');
console.log('✅ public/admin/auth.html - GitHub OAuth page');
console.log('✅ public/admin/auth-callback.html - OAuth callback handler');
console.log('✅ scripts/setup-cms.js - This setup script');
console.log('✅ CMS_SETUP.md - Complete setup guide\n');

console.log('🔗 Access your CMS at: https://valipokkann.com/admin/');
console.log('🔗 Authentication page: https://valipokkann.com/admin/auth.html\n');

console.log('💡 Tips:');
console.log('- The CMS will create commits directly to your GitHub repository');
console.log('- All content is stored as markdown files in src/data/');
console.log('- Images are stored in public/ directories');
console.log('- No database required - everything is version controlled!\n');

console.log('🎉 Setup complete! Follow the steps above to configure OAuth.'); 