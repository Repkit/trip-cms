import router from '../router'

const state = {
	email: {
		Id: '',
		Name: '',
		Content: '',
		Head: '',
		StaticPage: '0',
		Crawlable: '1',
		Category: '',
		Details: '',
		FullPage: '1',
		Status: '1',
		Timestamp: '',
		_links: {
			self: {
				href: ''
			},
			'page-url': {
				href: ''
			}
		}
	},
	emails: [],
    categories: [
        'auth/reset',
        'auth/changed-password',
        'auth/forgot-password',
        'notification-manager/notify-admin',
        'order/notify-owner-offline',
        'order/notify-owner-online-issue',
        'order/notify-owner-online-no-issue'
    ]
}

const mutations = {
	'LOAD_EMAIL' (state, data) {
		state.email = data
	},
	'LOAD_EMAILS' (state, emails) {
		state.emails = emails
	},
	clearEmailState (state) {
		state.email = {
			Id: '',
			Name: '',
			Content: '',
			Head: '',
			StaticPage: '0',
			Crawlable: '1',
			Category: '',
			Details: '',
			FullPage: '1',
			Status: '1',
			Timestamp: '',
			_links: {
				self: {
					href: ''
				},
				'page-url': {
					href: ''
				}
			}
		}
	}
}

const actions = {
	clearEmailState ({ commit }) {
		commit('clearEmailState')
	},
	toggleEmailStatus ({ commit, dispatch }, payload) {
		dispatch('callApi', { method: 'PATCH',
			ingoreBaseUrl: true,
			url: this._vm.CMS_BASE_URL + '/cms/pages/' + payload.Id,
			data: {
				Status: payload.Status
			} }).then((resp) => {
		}).catch((err) => {
			console.log(err)
		})
	},
	createEmail ({ commit, dispatch }, payload) {
        dispatch('validateEmail', payload)
		dispatch('callApi', { method: 'POST',
			ingoreBaseUrl: true,
			url: this._vm.CMS_BASE_URL + '/cms/pages',
			data: {
				Id: '',
				Name: payload.Name,
				Category: payload.Category,
				Content: payload.Content,
				Head: "", //payload.Head,
				FullPage: "1", //payload.FullPage,
				StaticPage: payload.StaticPage,
				Crawlable: "0", //payload.Crawlable,
				Details: payload.Details,
				Status: payload.Status
			} }).then((resp) => {
			router.push({ name: 'email-template', params: { id: resp.data.Id } })
			commit('Toast/_add', 'Email template created')
		}).catch((err) => {
			console.log(err)
			if(403 == err.response.status){
				commit('Toast/_addError', 'Forbidden (#403) - You are not allowed to perform this action!')
			}else{
				commit('Toast/_addError', 'Failed to publish email template')
			}
		})
	},
	saveEmail ({ commit, dispatch }, payload) {
        dispatch('validateEmail', payload)
		dispatch('callApi', {
			method: 'PATCH',
			ingoreBaseUrl: true,
			url: this._vm.CMS_BASE_URL + '/cms/pages/' + payload.Id,
			data: {
				Id: payload.Id,
				Name: payload.Name,
				Category: payload.Category,
				Content: payload.Content,
				Head: "", //payload.Head,
				FullPage: "1", //payload.FullPage,
				StaticPage: payload.StaticPage,
				Crawlable: "0", //payload.Crawlable,
				Details: payload.Details,
				Status: payload.Status
			}
		}).then((resp) => {
			commit('LOAD_EMAIL', resp.data)
			router.push({ name: 'email-template', params: { id: resp.data.Id } })
			commit('Toast/_add', 'Email template updated')
			document.getElementById('previewEmail').src = document.getElementById('previewEmail').src
		}).catch((err) => {
			console.log(err)
			if(403 == err.response.status){
				commit('Toast/_addError', 'Forbidden (#403) - You are not allowed to perform this action!')
			}else{
				commit('Toast/_addError', 'Failed to save email template')
			}
		})
	},
	loadEmail ({ commit, dispatch }, emailId) {
		dispatch('callApi', {
			method: 'GET',
			ingoreBaseUrl: true,
			url: this._vm.CMS_BASE_URL + '/cms/pages/' + emailId
		}).then((resp) => {
			commit('LOAD_EMAIL', resp.data)
		}).catch((err) => {
			console.log(err)
			if(403 == err.response.status){
				commit('Toast/_addError', 'Forbidden (#403) - You are not allowed to perform this action!')
			}else{
				commit('Toast/_addError', 'Failed to load email template')
			}
		})
	},
	fetchEmails ({ commit, dispatch, getters }) {
        //https://developers.dcsplus.net/workspaces/public/users/johnnyb/flux/api.php/cms/pages?filter[0][name]=Name&filter[0][term]=index&limit=10
		dispatch('callApi', {
			method: 'GET',
			ingoreBaseUrl: true,
			url: this._vm.CMS_BASE_URL + '/cms/pages'
		}).then((resp) => {
			commit('LOAD_EMAILS', resp.data._embedded.pages)
		}).catch((err) => {
			console.log(err)
			if(403 == err.response.status){
				commit('Toast/_addError', 'Forbidden (#403) - You are not allowed to perform this action!')
			}else{
				commit('Toast/_addError', 'Failed to load email templates')
			}
		})
	},
    validateEmail ({ commit, dispatch }, payload) {
        if(state.categories.indexOf(payload.Category)> -1){
            // continue
        }else{
            throw "Invalid email-template category"
        }
    }
}

const getters = {
	getEmails: (state) => {
		return state.emails
	},
	getEmail: (state) => {
		return state.email
	}
}

export default {
	// namespaced: true,s
	state,
	mutations,
	actions,
	getters
}
