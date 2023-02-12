const { defineConfig } = require('@vue/cli-service')
const path = require('path')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '^/api/*': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
  runtimeCompiler: true,
  configureWebpack: {
    resolve: {
      extensions: ['.js', '.vue'],
      alias: {
        '@utils': path.resolve(__dirname,'src/utils'),
        '@common': path.resolve(__dirname,'src/components/common')
      }
    }
  }
})