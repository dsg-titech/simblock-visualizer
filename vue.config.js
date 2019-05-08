module.exports = {
  productionSourceMap: false,
  lintOnSave: false,
  publicPath:
    process.env.NODE_ENV === "production" ? "/simblock-visualizer/" : "/",
  // workaround for:
  //   https://github.com/cvalenzuela/Mappa/issues/22
  configureWebpack: config => {
    config.optimization = {
      minimize: false
    };
  }
};
