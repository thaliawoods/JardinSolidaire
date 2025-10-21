require('dotenv').config();
const { spawn } = require('child_process');
const path = require('path');

const seeds = ['seed_bookings.js']; // keep it simple for now

function runSeed(file) {
  return new Promise((resolve, reject) => {
    const full = path.join(__dirname, file);
    console.log(`▶ Running ${file}`);
    const child = spawn(process.execPath, [full], { stdio: 'inherit' });
    child.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`${file} exited ${code}`))));
    child.on('error', reject);
  });
}

(async () => {
  try {
    for (const file of seeds) await runSeed(file);
    console.log('🎉 All seeds completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding pipeline failed:', err.message);
    process.exit(1);
  }
})();
