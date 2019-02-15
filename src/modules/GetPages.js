import router from '../router'

const state = {
	page: {
	  "Id": "",
	  "Name": "",
	  "Content": "",
	  "Head": "",
	  "StaticPage": "",
	  "Crawlable": "",
	  "Category": "",
	  "Details": "",
	  "FullPage": "",
	  "Status": "",
	  "Timestamp": "",
	  "_links": {
	    "self": {
	      "href": ""
	    },
	    "page-url": {
	      "href": ""
	    }
	  }
	},
	pages: []
}

const mutations = {
	'LOAD_PAGE' (state, data) {
		state.page = data
	},
	'LOAD_PAGES' (state, pages) {
		state.pages = pages
	}
}

const actions = {
	searchPages ({ commit, dispatch }, payload) {
		dispatch('callApi', {
			method: 'GET',
			ingoreBaseUrl: true,
			url: this._vm.CMS_BASE_URL + '/cms/pages?filter[1][name]=Name&filter[1][type]=like&filter[1][term]=' + payload
		}).then((res) => {
		}).catch((err) => {
			console.log(err)
		})
	},
	deletePage ({ commit, dispatch }, payload) {
		dispatch('callApi', { method: 'DELETE',
			ingoreBaseUrl: true,
			url: this._vm.CMS_BASE_URL + '/cms/pages/' + payload
		}).then((resp) => {
			dispatch('fetchPages')
			commit('Toast/_add', 'Page deleted')
		}).catch((err) => {
			console.log(err)
			commit('Toast/_addError', 'Failed to delete page')
		})
	},
	togglePageStatus ({ commit, dispatch }, payload) {
		dispatch('callApi', { method: 'PATCH',
			ingoreBaseUrl: true,
			url: this._vm.CMS_BASE_URL + '/cms/pages/' + payload.Id,
			data: {
				Status: payload.Status
			} }).then((resp) => {
			// commit('LOAD_PAGES', resp.data)
		}).catch((err) => {
			console.log(err)
		})
	},
	createPage ({ commit, dispatch }, payload) {
		dispatch('callApi', { method: 'POST',
			ingoreBaseUrl: true,
			url: this._vm.CMS_BASE_URL + '/cms/pages',
			data: {
				Id: '',
				Name: payload.Name,
				Content: payload.Content,
				Crawlable: 1,
				Status: 1,
				StaticPage: 1,
				Head: payload.Head,
				FullPage: '0'
			} }).then((resp) => {
			router.push({ name: 'page', params: { id: resp.data.Id } })
			commit('Toast/_add', 'Page created')
		}).catch((err) => {
			console.log(err)
			commit('Toast/_addError', 'Failed to publish page')
		})
	},
	savePage ({ commit, dispatch }, payload) {
		dispatch('callApi', { 
			method: 'PATCH',
			ingoreBaseUrl: true,
			url: this._vm.CMS_BASE_URL + '/cms/pages/' + payload.Id,
			data: {
				Category: payload.Category,
				Content: payload.Content,
				Crawlable: payload.Crawlable,
				Details: payload.Details,
				FullPage: payload.FullPage,
				Head: payload.Head,
				Id: payload.Id,
				Name: payload.Name,
				StaticPage: payload.StaticPage,
				Status: payload.Status
			} 
		}).then((resp) => {
			commit('LOAD_PAGE', resp.data)
			router.push({ name: 'page', params: { id: resp.data.Id } })
			commit('Toast/_add', 'Page updated')
			document.getElementById('previewPage').src=document.getElementById('previewPage').src

		}).catch((err) => {
			console.log(err)
			commit('Toast/_addError', 'Failed to save page')
		})
	},
	loadPage ({ commit, dispatch }, pageId) {
		dispatch('callApi', { 
			method: 'GET', 
			ingoreBaseUrl: true, 
			url: this._vm.CMS_BASE_URL + '/cms/pages/' + pageId 
		}).then((resp) => {
			commit('LOAD_PAGE', resp.data)
		}).catch((err) => {
			console.log(err)
			commit('Toast/_addError', 'Failed to load page')
		})
	},
	fetchPages ({ commit, dispatch, getters }) {
		dispatch('callApi', { 
			method: 'GET', 
			ingoreBaseUrl: true, 
			url: this._vm.CMS_BASE_URL + '/cms/pages' 
		}).then((resp) => {
			commit('LOAD_PAGES', resp.data._embedded.pages)
		}).catch((err) => {
			console.log(err)
			commit('Toast/_addError', 'Failed to load pages')
		})
	}
}

const getters = {
	getPages: (state) => {
		return state.pages
	},
	getPage: (state) => {
		return state.page
	}
}

export default {
	// namespaced: true,s
	state,
	mutations,
	actions,
	getters
}
