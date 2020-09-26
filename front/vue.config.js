// eslint-disable-next-line @typescript-eslint/no-var-requires
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

module.exports = {
  publicPath: '/',
  outputDir: '../public/vue-dist/',
  chainWebpack: (config) => {
    config.plugin('extract-css').use(MiniCssExtractPlugin, [
      {
        filename: 'static/[name].css',
        chunkFilename: ''
      }
    ])
    if (process.env.NODE_ENV === 'production') {
      config.output.filename('[name].js')
      config.output.chunkFilename('js/[name].js')
      config.module
        .rule('src/assets/')
        .test(/\.(png|jpe?g|gif|webp)(\?.*)?$/)
        .use('url-loader')
        .loader('url-loader')
        .options({
          limit: 4096,
          name: 'static/[name].[ext]'
        })
      config.splitChunks = {
        cacheGroups: {
          // eslint-disable-next-line @typescript-eslint/camelcase
          node_vendors: {
            test: /[\\/]node_modules[\\/]/,
            chunks: 'all',
            priority: 1
          }
        }
      }
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.join(__dirname, 'src/')
      }
    }
  },
  css: {
    loaderOptions: {
      sass: {
        implementation: require('sass')
      }
    }
  }
}
