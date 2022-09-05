module.exports = {
  moduleFileExtensions: ['js', 'ts'],
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.[jt]s?$': 'babel-jest',
  },
  testEnvironment: 'node',
  testMatch: ['<rootDir>/**/*.spec.js', '<rootDir>/**/*.spec.ts'],
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
};
