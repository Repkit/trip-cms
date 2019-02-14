const state = {
	open: false,
	targetPrimitive: null
}

const mutations = {
	'OPEN_FILEMENU' (state, target) {
		state.open = true,
		state.targetPrimitive = target
	},
	'CLOSE_FILEMENU' (state) {
		state.open = false,
		state.targetPrimitive = null
	},
	'SET_FILE' (state, path) {
		if (!state.targetPrimitive) debugger
		state.targetPrimitive.hndFileSelect(path)
		state.open = false,
		state.targetPrimitive = null
	}
}

const actions = {
}

const getters = {
	fileModalOpen: (state) => {
		return state.open
	}
}

export default {
	state,
	mutations,
	actions,
	getters
}
