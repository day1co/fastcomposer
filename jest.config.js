module.exports = {
  preset: 'ts-jest/presets/default',
  moduleFileExtensions: ['js', 'ts', 'jsx', 'tsx'],
  // ↓ DO NOT try to make test work w/ node16 esmodule support
  // ↓ it's almost unable to mock and totally unable to diag
  // extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.tsx?$': [ 'ts-jest', {
      useESM: false,
      diagnostics: {
        ignoreCodes: [
          'TS151001' // If you have issues related to imports, …
        ]
      }
    } ]
  },
  testEnvironment: 'node',
  testMatch: [
    '<rootDir>/**/*.spec.js',  '<rootDir>/**/*.spec.ts',
    '<rootDir>/**/*.spec.jsx', '<rootDir>/**/*.spec.tsx',
  ],
  transformIgnorePatterns: ['<rootDir>/node_modules/'],

  resetMocks: true
};
