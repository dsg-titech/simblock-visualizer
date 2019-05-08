module.exports = {
  productionSourceMap: false,
  lintOnSave: false,
  // workaround for:
  //   https://github.com/cvalenzuela/Mappa/issues/22
  configureWebpack: config => {
    config.optimization = {
      minimize: false
    };
  }
};
