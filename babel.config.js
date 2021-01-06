module.exports = (api) => {
  const env = api.env();
  if (env !== 'test') {
    // see https://github.com/vuejs/vue-cli/issues/3678
    return {
      presets: [['@vue/app', { useBuiltIns: 'entry' }]],
    };
  } else {
    return {
      presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
    };
  }
};
