/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: [
    '<rootDir>/e2e/',        // ✅ ignore Playwright tests
    '<rootDir>/frontend/e2e', // (future proof)
    '<rootDir>/playwright-report/',
    '<rootDir>/test-results/'
  ],
};
