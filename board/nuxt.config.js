
module.exports = {
  mode: 'spa',
  env: {
    baseUrl: process.env.BASE_URL || 'http://localhost:3000/board/'
  },
  router: {
    base: '/board/',
    middleware: 'initApp'
  },
  /*
  ** Headers of the page
  */
  head: {
    title: 'Remark',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js + Vuetify.js project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' },
      { rel: 'apple-touch-icon', sizes: '57x57', href: 'https://s3-ap-northeast-1.amazonaws.com/tappay-image-resource/apple-icon-57x57.png' },
      { rel: 'apple-touch-icon', sizes: '60x60', href: 'https://s3-ap-northeast-1.amazonaws.com/tappay-image-resource/apple-icon-60x60.png' },
      { rel: 'apple-touch-icon', sizes: '72x72', href: 'https://s3-ap-northeast-1.amazonaws.com/tappay-image-resource/apple-icon-72x72.png' },
      { rel: 'apple-touch-icon', sizes: '76x76', href: 'https://s3-ap-northeast-1.amazonaws.com/tappay-image-resource/apple-icon-76x76.png' },
      { rel: 'apple-touch-icon', sizes: '114x114', href: 'https://s3-ap-northeast-1.amazonaws.com/tappay-image-resource/apple-icon-114x114.png' },
      { rel: 'apple-touch-icon', sizes: '120x120', href: 'https://s3-ap-northeast-1.amazonaws.com/tappay-image-resource/apple-icon-120x120.png' },
      { rel: 'apple-touch-icon', sizes: '144x144', href: 'https://s3-ap-northeast-1.amazonaws.com/tappay-image-resource/apple-icon-144x144.png' },
      { rel: 'apple-touch-icon', sizes: '152x152', href: 'https://s3-ap-northeast-1.amazonaws.com/tappay-image-resource/apple-icon-152x152.png' },
      { rel: 'apple-touch-icon', sizes: '180x180', href: 'https://s3-ap-northeast-1.amazonaws.com/tappay-image-resource/apple-icon-180x180.png' },
      { rel: 'icon', type: 'image/png', sizes: '192x192', href: 'https://s3-ap-northeast-1.amazonaws.com/tappay-image-resource/android-icon-192x192.png' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: 'https://s3-ap-northeast-1.amazonaws.com/tappay-image-resource/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes: '96x96', href: 'https://s3-ap-northeast-1.amazonaws.com/tappay-image-resource/favicon-96x96.png' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: 'https://s3-ap-northeast-1.amazonaws.com/tappay-image-resource/favicon-16x16.png' }
    ]
  },
  plugins: [
    '~/plugins/vuetify.js',
    '~/plugins/axios.js',
    '~/plugins/vue-notification.js'
  ],
  css: [
    '~/assets/style/app.styl',
    'mdi/css/materialdesignicons.min.css'
  ],
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },

  modules: [
    '@nuxtjs/axios'
  ],

  axios: {
    browserBaseURL: '/'
  },

  /*
  ** Build configuration
  */
  build: {
    vendor: [
      '~/plugins/vuetify.js'
    ],
    extractCSS: true,
    /*
    ** Run ESLint on save
    */
    extend (config, ctx) {
      // if (ctx.isDev && ctx.isClient) {
      //   config.module.rules.push({
      //     enforce: 'pre',
      //     test: /\.(js|vue)$/,
      //     loader: 'eslint-loader',
      //     exclude: /(node_modules)/
      //   })
      // }
    }
  }
}
