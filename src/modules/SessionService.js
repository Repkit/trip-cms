import router from '../router'

const state = {
	authToken: {},
	isLoginRequired: true,
	queryParams: '',
	userLoginStatus: false,
	keepAliveTimer: null,
	refreshTokenTimer: null,
	requestsCounter: null
}

const mutations = {
	SET_TOKEN (state, tokenObject) {
		state.authToken = tokenObject
		this._vm.$http.defaults.headers['Authorization'] = tokenObject.Value // set Authorization header
	},
	SET_USER_LOGIN_STATUS: (state, value) => {
		state.userLoginStatus = value
	},
	SET_KEEP_ALIVE_TIMER: (state, value) => {
		state.keepAliveTimer = value
	},
	SET_REFRESH_TOKEN_TIMER: (state, value) => {
		state.refreshTokenTimer = value
	},
	SET_REQUEST_COUNTER: (state, value) => {
		state.requestsCounter = value
	},
	INCREMENT_REQUESTS_COUNTER: state => {
		state.requestsCounter++
	},
	SET_QUERY_PARAMS: (state, value) => {
		state.queryParams = value // set query params from server
	}
}

const actions = {
	async callApi ({ commit, dispatch, getters, state }, { method, url, data, ingoreBaseUrl }) { // main method for CRUD operations
		if (state.isLoginRequired && (getters.hasAuthToken && getters.isLoggedIn)) {
			data = data || {}

			const expiredTokenHandler = (method, url, data) => { // expired token handler
				return dispatch('refreshToken').then(() => // refresh token
					dispatch('callApi', { method, url, data }) // make the call again after refreshing new token
				)
			}
			if (getters.tokenHasLifes) {
				const objectForHashCall = {
					params: {
						endpoint: url
					},
					data,
					ingoreBaseUrl
				}
				await dispatch('getHash', objectForHashCall) // get authentication hash
				url = await dispatch('constructUrl', { url, queryParams: state.queryParams }) // construct full url for actual call
				return dispatch(method, { url, data, ingoreBaseUrl }).then(response => { // make the actual call
					if (response.data.Status === 511) { // token expired
						expiredTokenHandler(method, url, data) // handle expired token error
					} else {
						commit('INCREMENT_REQUESTS_COUNTER') // increment requests counter after each request
					}
					return response
				}).catch(error => {
					console.log('Request error: ', error)
					return Promise.reject(error)
					// return error
				})
			} else {
				expiredTokenHandler(method, url, data)
			}
		}
	},
	constructUrl ({}, { url, queryParams }) {
		if (url.length && url.includes('?')) { // already have query parameters
			url += '&' + queryParams
		} else {
			url += '?' + queryParams
		}
		return url
	},
	getHash ({ commit, dispatch, getters }, requestData) { // get authentication hash from server (renewed for every call)
		let params = ''
		if (!requestData.ingoreBaseUrl) {
			requestData.params.endpoint = this._vm.BASE_URL + requestData.params.endpoint
		}
		const queryParams = Object.keys(requestData.params)

		queryParams.forEach((queryParam, index) => { // concat queryParams in string
			params += queryParam + '=' + requestData.params[queryParam]
			if (index < queryParams.length - 1) {
				params += '&'
			}
		})

		const payload = {
			url: this._vm.AUTH_URL + '?' + params, // set empty url for hash call
			params: requestData.params // set query params
			// baseUrl: this._vm.AUTH_URL // change baseUrl for hash request
		}

		// construct data for POST calls
		if (requestData.hasOwnProperty('data')) {
			payload.data = {}

			for (let key in requestData.data) {
				payload.data['postData[' + key + ']'] = requestData.data[key]
			}
		}

		// hash call
		return dispatch('POST', payload).then(response => {
			this._vm.$http.defaults.headers['x-hash'] = response.data.sha // set x-hash header
			commit('SET_QUERY_PARAMS', response.data.query) // set stored query params
		})
	},
	processToken ({ commit, dispatch }, data) {
		if (data.Status === 1) {
			commit('SET_TOKEN', data.Object) // set token on state
			commit('SET_REQUEST_COUNTER', 0) // set requests counter
			commit('SET_COOKIE', { name: 'token', value: data.Object.Value, expireTime: data.Object.TTL }) // store token in cookie for ttl seconds
			dispatch('keepAliveServerSide', data.Object.TTL) // set refresh token timer
		}
	},
	generateToken ({ dispatch, state }) {
		let endpoint = '/en/authentication/token/generate'
		const payload = { params: { endpoint } } // payload for hash call

		return dispatch('getHash', payload).then(() => {
			endpoint = endpoint + '?' + state.queryParams

			return dispatch('GET', { url: endpoint }).then(response => {
				return dispatch('processToken', response.data)
			})
		})
	},
	refreshToken ({ dispatch, state }) {
		let endpoint = '/en/authentication/token/refresh'
		const payload = { params: { endpoint } } // payload for hash call

		return dispatch('getHash', payload).then(() => {
			endpoint = endpoint + '?' + state.queryParams

			return dispatch('GET', { url: endpoint }).then(response => {
				return dispatch('processToken', response.data)
			})
		})
	},
	keepAliveClientSide ({ commit, dispatch }) { // keep alive for 30 minutes
		commit('SET_KEEP_ALIVE_TIMER',
			setInterval(function () {
				dispatch('logout')
			}, 1800000)
		)
	},
	resetKeepAliveClientSideTimer ({ dispatch, state }) { // reset the 30 minutes timer
		clearInterval(state.keepAliveTimer)
		dispatch('keepAliveClientSide')
	},
	keepAliveServerSide ({ commit, dispatch, state }, ttl) { // keep alive user on server by refreshing the token
		if (state.refreshTokenTimer) {
			clearInterval(state.refreshTokenTimer)
		}

		commit('SET_REFRESH_TOKEN_TIMER',
			setInterval(() => {
				if (state.keepAliveTimer) {
					dispatch('refreshToken')
				}
			}, ttl * 1000) // refresh token after "ttl" seconds
		)
	},
	async login ({ commit, dispatch, getters, state }, credentials) {
		if (!getters.hasAuthToken) {
			await dispatch('generateToken')
		}

		let endpoint = '/auth/login'
		return dispatch('getHash', { params: { endpoint }, data: credentials }).then(() => {
			endpoint = endpoint + '?' + state.queryParams
			return dispatch('POST', { url: endpoint, data: credentials }).then(response => {
				commit('SET_COOKIE', { name: 'userId', value: response.data.UserId }) // store userId in cookie
				commit('SET_USER_LOGIN_STATUS', true) // set isLoggedIn status
				commit('INCREMENT_REQUESTS_COUNTER') // increment requests counter after each request
				return response
			})
		})
	},
	logout ({ commit, dispatch, state }) {
		dispatch('callApi', { method: 'POST', url: '/auth/logout' }).then(() => {
			commit('SET_USER_LOGIN_STATUS', false) // set logged out status for user

			// clear and delete "keepAlive" timers
			clearInterval(state.keepAliveTimer)
			commit('SET_KEEP_ALIVE_TIMER', null)
			clearInterval(state.refreshTokenTimer)
			commit('SET_REFRESH_TOKEN_TIMER', null)

			commit('CLEAR_ALL_COOKIES') // delete all cookies
			commit('SET_TOKEN', {}) // delete authToken from application
			router.push('/login') // redirect to login
		})
	},
	checkUserSessionServer ({ commit, dispatch, state }, data) {
		let url = '/auth/login/' + data.userId
		const objectForHashCall = {
			params: {
				endpoint: url
			}
		}

		return dispatch('getHash', objectForHashCall).then(() => {
			this._vm.$http.defaults.headers['Authorization'] = data.token // set header with token from cookie
			// verify the login state for user
			url = url + '?' + state.queryParams
			return dispatch('GET', { url }).then(async response => { // get user status from server
				if (response && response.status === 200) {
					commit('SET_USER_LOGIN_STATUS', true) // set user status as logged in
					await dispatch('refreshToken') // force token refresh
				} else {
					commit('CLEAR_ALL_COOKIES') // if is not logged in on the server, clear all cookies
				}

				return response
			}).catch(() => {
				commit('CLEAR_ALL_COOKIES') // if is not logged in on the server, clear all cookies
			})
		})
	}
}

const getters = {
	hasAuthToken: state => {
		return state.authToken.hasOwnProperty('Value')
	},
	tokenHasLifes () {
		return state.authToken.Lifes > state.requestsCounter
	},
	isLoggedIn: state => {
		return state.userLoginStatus
	},
	isLoginRequired: state => {
		return state.isLoginRequired
	},
	getQueryParams: state => {
		return state.queryParams // get query params seted from server
	},
	getToken () {
		return state.authToken.Value
	}
}

export default {
	state,
	mutations,
	actions,
	getters
}
