module.exports = {
  preset: 'ts-jest/presets/default',
  moduleFileExtensions: ['js', 'ts'],
  // extensionsToTreatAsEsm: ['.ts'], // ¯\_(ツ)_/¯
  transform: {
    '^.+\\.[t]s?$': [ 'ts-jest', { useESM: false } ]
  },
  testEnvironment: 'node',
  testMatch: ['<rootDir>/**/*.spec.js', '<rootDir>/**/*.spec.ts'],
  transformIgnorePatterns: ['<rootDir>/node_modules/']
};
