'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  TRACKER_URL: '"http://82.202.236.216:9090/"',
  PEERJS_KEY: '"7okdvaaamgy9o1or"'
})
