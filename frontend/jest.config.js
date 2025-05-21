const nextJest = require('next/jest')

const createJestConfig = nextJest({ dir: './' })

const customJestConfig = {
  // rootDir: 'src',
  testMatch: ['**/tests/**/*.+(js|jsx|ts|tsx)', '**/?(*.)+(test).+(js|jsx|ts|tsx)'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',  // ou 'ts-jest' si vous utilisez TS
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
}

module.exports = createJestConfig(customJestConfig)