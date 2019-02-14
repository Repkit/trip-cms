const uuid = require('uuid/v4')

const state = {
	toasts: []
	// TODO: limit max no of toasts at once to 5;
}

const intervalHandler = (store, id) => {
	let allToasts = store.getters['Toast/_toasts']
	let found = allToasts.find((toast) => {
		return toast.id === id
	})
	if (found) {
		const decrement = 10
		if (found.ttl >= decrement) {
			found.ttl -= decrement
		}
		if (found.ttl < decrement) {
			store.commit('Toast/_remove', found)
		}
	} else {
		console.error('could not act on toast, interval is ')
	}
}

const mutations = {
	_add (state, payload) {
		const id = uuid()
		state.toasts.push({
			id: id,
			intervalID: window.setInterval(intervalHandler, 300, this, id),
			msg: payload,
			ttl: 100,
			type: 'alert-success'
		})
	},
	_addError (state, payload) {
		const id = uuid()
		state.toasts.push({
			id: id,
			intervalID: window.setInterval(intervalHandler, 300, this, id),
			msg: payload,
			ttl: 100,
			type: 'alert-error'
		})
	},
	_addInfo (state, payload) {
		state.toasts.push({
			type: 'alert-info',
			msg: payload
		})
	},
	_addWarning (state, payload) {
		state.toasts.push({
			type: 'alert-warning',
			msg: payload
		})
	},
	_remove (state, toast) {
		let index = state.toasts.findIndex((current) => current.id === toast.id)
		if (index >= 0) {
			window.clearInterval(state.toasts[index].intervalID)
			state.toasts.splice(index, 1)
		}
	}
}

const actions = {
}

const getters = {
	_toasts: (state) => {
		return state.toasts
	}
}

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters
}
