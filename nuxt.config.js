const pkg = require('./package')
const {resolve} = require('path')

module.exports = {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: 'monitor 后台',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {hid: 'description', name: 'description', content: pkg.description},
      {'http-equiv': 'X-UA-Compatible', content: 'IE=edge,chrome=1'}
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: {color: '#fff'},

  /*
  ** Global CSS
  */
  css: [
    'element-ui/lib/theme-chalk/index.css'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/element-ui',
    '@/plugins/svg-icon',
    '@/plugins/filters'
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/axios'
  ],

  axios: {
    browserBaseURL: "/api"
    // See https://github.com/nuxt-community/axios-module#options
  },
  router: {
    base: ''
  },

  /*
  ** Build configuration
  */
  build: {
    vendor: ['axios', 'element-ui'],
    transpile: [/^element-ui/],

    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      const svgRule = config.module.rules.find(rule => rule.test.test('.svg'))
      svgRule.exclude = [resolve(__dirname, 'assets/svg')]

      // Includes /assets/svg for svg-sprite-loader
      config.module.rules.push({
        test: /\.svg$/,
        include: [resolve(__dirname, 'assets/svg')],
        loader: 'svg-sprite-loader',
        options: {
          symbolId: 'icon-[name]'
        }
      })
    }
  }
};
