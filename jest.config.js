module.exports = {
  moduleFileExtensions: ['js'],
  transform: {
    '^.+\\.js?$': 'babel-jest',
  },
  testEnvironment: 'node',
  testMatch: ['<rootDir>/**/*.spec.js'],
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
};
