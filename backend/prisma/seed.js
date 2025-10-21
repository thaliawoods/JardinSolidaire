// prisma/seed.js
require('dotenv').config();
const { spawn } = require('child_process');
const path = require('path');

const seeds = [
  'seed_skills.js',
  'seed_users.js',
  'seed_gardeners.js',
  'seed_owners.js',
  'seed_gardens.js',
  'seed_bookings.js',
];

function runSeed(file) {
  return new Promise((resolve, reject) => {
    const full = path.join(__dirname, file);
    console.log(`▶ Running ${file}`);
    const child = spawn(process.execPath, [full], { stdio: 'inherit' });
    child.on('close', (code) => {
      if (code !== 0) reject(new Error(`Seed ${file} exited with code ${code}`));
      else {
        console.log(`✅ ${file} completed`);
        resolve();
      }
    });
    child.on('error', reject);
  });
}

(async () => {
  try {
    for (const file of seeds) {
      await runSeed(file);
    }
    console.log('🎉 All seeds completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding pipeline failed:', err.message);
    process.exit(1);
  }
})();
