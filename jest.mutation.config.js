// ============================================================================
// Apps4Brew / Słoik — Stryker Mutation Test Runner (BR-TEST-032, Z-038)
// Wybiera wyłącznie szybkie testy czystej logiki domenowej w środowisku node.
// ============================================================================

module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|tsx)$': ['babel-jest', {
      presets: [
        '@babel/preset-typescript',
      ],
      plugins: [
        '@babel/plugin-transform-modules-commonjs',
      ],
    }],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: [
    '<rootDir>/src/core/__tests__/**/*.test.ts',
    '<rootDir>/tests/domain-coverage.test.ts',
    '<rootDir>/tests/state-machine.prop.test.ts',
    '<rootDir>/tests/corpus-oracle.test.ts',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'node'],
  setupFiles: ['<rootDir>/jest.setup.js'],
  setupFilesAfterEnv: ['<rootDir>/jest.after-env.js'],
  testPathIgnorePatterns: [
    '/node_modules/',
  ],
  testTimeout: 5000,
};
