const fs = require('fs');
const path = require('path');

const requiredAssets = [
  // App icons
  './assets/image/icon.png',
  './assets/icon.png',
  './assets/icons/app-icon.png',
  './assets/icons/verified.png',
  
  // Navigation icons
  './assets/nav/home-active.png',
  './assets/nav/home.png',
  './assets/nav/activity-active.png',
  './assets/nav/activity.png',
  './assets/nav/activity-notify.png',
  './assets/nav/add-active.png',
  './assets/nav/add.png',
  './assets/nav/search-active.png',
  './assets/nav/search.png',
  './assets/nav/profile-active.png',
  './assets/nav/profile.png',
  
  // Gender images
  './assets/image/male.png',
  './assets/image/female.png',
  
  // Eye icons
  './assets/image/eye_open.png',
  './assets/image/eye_closed.png',
];

console.log('🔍 Checking required assets...\n');

let missingAssets = [];
let foundAssets = [];

requiredAssets.forEach(asset => {
  const assetPath = path.join(process.cwd(), asset);
  if (fs.existsSync(assetPath)) {
    foundAssets.push(asset);
    console.log(`✅ ${asset}`);
  } else {
    missingAssets.push(asset);
    console.log(`❌ MISSING: ${asset}`);
  }
});

console.log('\n' + '='.repeat(50));
console.log(`Found: ${foundAssets.length}/${requiredAssets.length}`);
console.log(`Missing: ${missingAssets.length}/${requiredAssets.length}`);
console.log('='.repeat(50));

if (missingAssets.length > 0) {
  console.log('\n⚠️  WARNING: Missing assets detected!');
  console.log('The build may fail or the app may crash.');
  console.log('\nMissing files:');
  missingAssets.forEach(asset => console.log(`  - ${asset}`));
  console.log('\n💡 Create these files or update the code to use existing paths.');
  process.exit(1);
} else {
  console.log('\n✅ All required assets found! Ready to build.');
  process.exit(0);
}