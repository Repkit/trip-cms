const state = {
	mode: 'split',
	settings: {
		wrap: false,
		line: true
	}
}

const mutations = {
	UPDATE_MODE (state, payload) {
		state.mode = payload
	},
	UPDATE_SETTINGS (state, payload) {
		state.settings = payload
	}
}

const actions = {
	updateMode ({ commit }, payload) {
		commit('UPDATE_MODE', payload)
	},
	updateSettings ({ commit }, payload) {
		commit('UPDATE_SETTINGS', payload)
	}
}

const getters = {
	getMode: (state) => {
		return state.mode
	},
	getSettings: (state) => {
		return state.settings
	}
}

export default {
	state,
	mutations,
	actions,
	getters
}
