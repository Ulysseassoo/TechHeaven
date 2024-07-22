module.exports = {
    testEnvironment: 'node',
    transform: {
      '^.+\\.mjs$': 'babel-jest',
    },
    moduleFileExtensions: ['js', 'jsx', 'mjs'],
    testMatch: ['<rootDir>/Test/**/*.test.mjs'],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
  