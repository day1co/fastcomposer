module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/essential', 'eslint:recommended'],
  ignorePatterns: [
    'dist'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-unused-vars': [ 'error', { 'args': 'none' } ],
    'no-redeclare': 'off',
    'vue/no-mutating-props': 'off'
  },
  overrides: [
    {
      files: [
        '**/Test/*.[tj]s',
        '**/*.spec.[tj]s'
      ],
      env: {
        jest: true
      },
      rules: {
        'no-unused-vars': 'off'
      }
    }
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 9,
    sourceType: 'module',
    allowImportExportEverywhere: true,
  },
}
