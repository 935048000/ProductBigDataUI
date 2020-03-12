/*
 * @Author: your name
 * @Date: 2019-12-25 16:07:52
 * @LastEditTime : 2019-12-27 10:34:52
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ds-frame-ui\yewuzhongtai\config\index.js
 */
'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {

    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',

    proxyTable: {
      '/api': {     //这里最好有一个 /
        target: 'http://dc.daisha.com.cn:8094',  // 后台接口域名
        changeOrigin: true,  //是否跨域
        pathRewrite: {
          '^/api': ''
        }
      },
      '/ApiurlStorehouse': {     //这里最好有一个 /
        target: 'http://114.55.126.232:8085',  // 后台接口域名
        changeOrigin: true,  //是否跨域
        pathRewrite: {
          '^/ApiurlStorehouse': ''
        }
      },
      '/ApiUrls': {     //这里最好有一个 /
        target: 'http://114.55.126.232:8082',  // 后台接口域名
        changeOrigin: true,  //是否跨域
        pathRewrite: {
          '^/ApiUrls': ''
        }
      },
      '/ApiUrlMember': {     //这里最好有一个 /
        target: 'http://115.29.228.150:8626',  // 后台接口域名
        changeOrigin: true,  //是否跨域
        pathRewrite: {
          '^/ApiUrlMember': ''
        }
      },
      '/SecondApiUrlMember': {     //这里最好有一个 /
        target: 'http://114.55.126.232:8087',  // 后台接口域名
        changeOrigin: true,  //是否跨域
        pathRewrite: {
          '^/SecondApiUrlMember': ''
        }
      },
      '/TotalIntegral': {     //这里最好有一个 /
        target: 'https://practice.jifen360.com',  // 后台接口域名
        changeOrigin: true,  //是否跨域
        pathRewrite: {
          '^/TotalIntegral': ''
        }
      },
      '/testApi': {     //这里最好有一个 /
        target: 'http://10.10.67.254:8094',  // 后台接口域名
        changeOrigin: true,  //是否跨域
        pathRewrite: {
          '^/testApi': ''
        }
      },
      '/Gxpay': {     //这里最好有一个 /
        target: 'http://114.55.126.232:8086',  // 后台接口域名
        changeOrigin: true,  //是否跨域
        pathRewrite: {
          '^/Gxpay': ''
        }
      },
    },
    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-


    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // 添加test pre prod 三处环境的配制
    prodEnv: require('./prod.env'),
    testEnv: require('./test.env'),
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: ' ./',

    /**
     * Source Maps
     */

    productionSourceMap: false,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: true,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
