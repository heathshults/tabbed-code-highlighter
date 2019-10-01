// ====== BLUEPRINT DESIGN SYSTEM CONFIGURATION ====== //

const path = require('path')
const appCWD = process.cwd()
const framekitInfo = require(`${appCWD}/package.json`)
const tokensInfo = require(`${appCWD}/node_modules/cxd-ds-tokens/package.json`)
var Config = null

module.exports = Config = {
  framekit: {
    framekitVersion: framekitInfo.version,
    tokenVersion: tokensInfo.version
  },
  compatTokens: [{
    'release': '01-2019',
    'framekit': '0.2.0',
    'tokens': '1.3.0'
  }]
}
