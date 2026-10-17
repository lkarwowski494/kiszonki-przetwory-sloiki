// ============================================================================
// Apps4Brew / Słoik — Stryker Mutation Test Runner (BR-TEST-032, Z-038)
// Wybiera wyłącznie szybkie testy czystej logiki domenowej w środowisku node.
// ============================================================================

module.exports = {
  testEnvironment: 'node',
  testMatch: [
    '<rootDir>/dist/src/core/__tests__/**/*.test.js',
    '<rootDir>/dist/tests/domain-coverage.test.js',
    '<rootDir>/dist/tests/state-machine.prop.test.js',
    '<rootDir>/dist/tests/corpus-oracle.test.js',
  ],
  moduleFileExtensions: ['js', 'json', 'node'],
  setupFiles: ['<rootDir>/jest.setup.js'],
  setupFilesAfterEnv: ['<rootDir>/jest.after-env.js'],
  testTimeout: 5000,
};
