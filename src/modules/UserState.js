const state = {
	currentUserDetails: {},
	currentUserRoles: {}
}

const mutations = {
}

const actions = {
	getAllRoles ({}) {

	},
	getUserRoles ({ dispatch }, userId) {
		dispatch('callApi', { method: 'GET', params: { url: '' } })
	},
	getUserDetails ({}, userId) {

	}
}

const getters = {
}

export default {
	state,
	mutations,
	actions,
	getters
}
