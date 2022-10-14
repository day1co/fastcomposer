module.exports = {
  root: true,
  env: {
    browser: true,
  },
  extends: ['eslint:recommended'],
  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'vue/no-mutating-props': 'off',
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 9,
    sourceType: 'module',
    allowImportExportEverywhere: true,
  },
};
