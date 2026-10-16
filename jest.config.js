module.exports = {
  testEnvironment: 'node',
  testMatch: ['<rootDir>/dist/**/__tests__/**/*.test.js'],
  moduleFileExtensions: ['js', 'json', 'node'],
  setupFiles: ['<rootDir>/jest.setup.js'],
};
