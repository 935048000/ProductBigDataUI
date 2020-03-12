/*
 * @Author: your name
 * @Date: 2019-12-25 16:07:52
 * @LastEditTime : 2019-12-26 16:13:52
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ds-frame-ui\yewuzhongtai\config\dev.env.js
 */
'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"develope"',
  EVN_CONFIG: '"dev"'
})
