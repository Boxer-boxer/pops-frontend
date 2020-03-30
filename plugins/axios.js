import https from 'https'

export default function({ $axios }) {
  $axios.defaults.httpsAgent = new https.Agent({ rejectUnauthorized: false })
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
}
