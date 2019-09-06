
module.exports = {
  chainWebpack: config => {
    config.module
      .rule('ejs')
      .test(/\.ejs$/)
      .use('raw-loader')
      .loader('raw-loader')
  },
};
