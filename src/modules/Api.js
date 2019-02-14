const state = {
	/* AUTH_URL: window.AUTH_URL || 'http://192.168.0.30/dynapack-authentication/hash.php',
	BASE_URL: window.BASE_URL || 'http://192.168.0.30/dynapack/clients/bitusi/public/index.php',
	API_BASE_URL: window.API_BASE_URL || 'http://192.168.0.30/dynapack/clients/bitusi/public/api.php',
	CMS_BASE_URL: window.CMS_BASE_URL || '',
	FILE_MANAGER: 'http://192.168.0.30/dynapack/clients/bitusi/public/admin/bridges/php-local/index.php',
	UPLOAD_PATH: 'http://192.168.0.30/dynapack/clients/bitusi/public/uploads/cms/',
	PROJECT_BASE_URL: window.PROJECT_BASE_URL */
}

const mutations = {}

const actions = {
	GET ({ getters }, payload) {
		const url = payload.url
		let baseURL = payload.baseUrl || this._vm.BASE_URL
		const params = payload.params || ''

		if (payload.ingoreBaseUrl) {
			baseURL = ''
		}
		return this._vm.$http({
			method: 'get',
			url,
			baseURL,
			params
		})
	},
	POST ({ getters }, payload) {
		const data = payload.data || {}
		const url = payload.url
		let baseURL = payload.baseUrl || this._vm.BASE_URL

		if (payload.ingoreBaseUrl) {
			baseURL = ''
		}
		return this._vm.$http({
			method: 'post',
			url,
			data,
			baseURL
		})
	},
	PUT ({ getters }, payload) {
		const data = payload.data || {}
		const url = payload.url
		let baseURL = payload.baseUrl || this._vm.BASE_URL
		if (payload.ingoreBaseUrl) {
			baseURL = ''
		}
		return this._vm.$http({
			method: 'put',
			url,
			data,
			baseURL
		})
	},
	PATCH ({ getters }, payload) {
		const data = payload.data || {}
		const url = payload.url
		let baseURL = payload.baseUrl || this._vm.BASE_URL

		if (payload.ingoreBaseUrl) {
			baseURL = ''
		}
		return this._vm.$http({
			method: 'patch',
			url,
			data,
			baseURL
		})
	},
	DELETE ({ getters }, payload) {
		const url = payload.url
		let baseURL = payload.baseUrl || this._vm.BASE_URL

		if (payload.ingoreBaseUrl) {
			baseURL = ''
		}
		return this._vm.$http({
			method: 'delete',
			url,
			baseURL
		})
	}
}

const getters = {
	/* getAuthUrl: (state) => {
		return state.AUTH_URL
	},
	getBaseUrl: function (state) {
		return.BASE_URL
	},
	getApiBaseUrl: (state) => {
		return this._vm.API_BASE_URL
	},
	getCmsBaseUrl: (state) => {
		return this._vm.CMS_BASE_URL
	},
	getFileManager: (state) => {
		return this._vm.FILE_MANAGER
	},
	getUploadPath: (state) => {
		return this._vm.UPLOAD_PATH
	} */
}

export default {
	state,
	mutations,
	actions,
	getters
}
