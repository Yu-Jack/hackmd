export default function ({ $axios, redirect }) {
  $axios.onRequest((config) => {
    console.log('Making request to ' + config.url)
  })

  $axios.onError((error) => {
    const code = parseInt(error.response && error.response.status)
    if (code === 403) {
      location.href = '/'
    }
  })

  // Adds header: `Authorization: 123` to all requests
  // $axios.setHeader('Authorization', '123')
}
