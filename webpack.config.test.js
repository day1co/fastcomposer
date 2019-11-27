const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: 'development',
  output: {
    devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]',
  },
  target: 'node',
  externals: [nodeExternals()],
  devtool: 'inline-cheap-module-source-map',
};
