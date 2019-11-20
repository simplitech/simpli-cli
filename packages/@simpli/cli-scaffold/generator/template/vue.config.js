module.exports = {
  // Project deployment base
  // By default we assume your app will be deployed at the root of a domain,
  // e.g. https://www.my-app.com/
  // If your app is deployed at a sub-path, you will need to specify that
  // sub-path here. For example, if your app is deployed at
  // https://www.foobar.com/my-app/
  // then change this to '/my-app/'
  publicPath: process.env.BASE_URL || '/',

  // where to output built files
  outputDir: process.env.OUTPUT_DIR || 'dist',

  // vue runtime mode
  runtimeCompiler: true,

  // tweak internal webpack configuration.
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  chainWebpack: config => {},

  // configure webpack-dev-server behavior
  devServer: {
    open: process.platform === 'darwin',
    host: process.env.DEV_HOST || '0.0.0.0',
    port: Number(process.env.DEV_PORT) || 8080,
    https: false,
    hotOnly: false,
    // See https://github.com/vuejs/vue-cli/blob/dev/docs/cli-service.md#configuring-proxy
    proxy: null, // string | Object
    before: app => {},
  },
}
