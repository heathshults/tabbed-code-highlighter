module.exports = function(api) {
  process.env.NODE_ENV = 'development'
  if (process.env.NODE_ENV === 'production') {
    api.cache(true)
  } else {
    if (process.env.NODE_ENV === 'development') {
      api.cache(false)
      // console.log(process.env.NODE_ENV)
      // var isProd = api.cache(() => process.env.NODE_ENV === 'production')
      // var isDev = api.cache(() => process.env.NODE_ENV === 'development')
      const presets = [
        '@babel/preset-env',
        '@babel/react'
      ]
      const plugins = [
        'dynamic-import-node-babel-7',
        '@babel/plugin-transform-modules-commonjs',
        '@babel/plugin-proposal-export-namespace-from'
      ]

      return {
        presets,
        plugins
      }
    }
  }
}
