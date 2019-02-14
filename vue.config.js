// const BASE_URL = require('./config.js')
// process.env.VUE_APP_BASE_URL = require('./config.json').base_url

module.exports = {
	baseUrl: process.env.NODE_ENV === 'production'
		? ''
		: '/'
}
