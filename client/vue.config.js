module.exports = {
  lintOnSave: false,
  productionSourceMap: false,
  css: {
    loaderOptions: {
      stylus: {
        import: ['~@/style/imports']
      }
    }
  },
  pwa : {
    name: 'Area'
  }
};
