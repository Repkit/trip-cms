import axios from 'axios'
import router from '../router'

const state = {
	snippet: {
		Id: '',
		Name: '',
		Template: '',
		DataUrl: null,
		Status: '1',
		PreScript: null,
		PostScript: '',
		Css: '',
		Params: null,
		Details: null,
		Category: null,
		Static: '1',
		Timestamp: '',
		_links: {
			self: {
				href: ''
			}
		},
		Placeholder: '',
		Preview: ''
	},
	widgets: [],
	snippets: [],
	datasource: [],
	dataresponse: '',
	datasourceparams: '',
	postscriptcontent: ''
}

const mutations = {
	LOAD_SNIPPET (state, data) {
		state.snippet = data
	},
	UPDATE_SNIPPET (state, payload) {
		state.snippet.Template = payload
	},
	UPDATE_SNIPPET_CSS (state, payload) {
		state.snippet.Css = payload
	},
	LOAD_SNIPPETS (state, snippets) {
		state.snippets = snippets
	},
	LOAD_WIDGETS (state, widgets) {
		state.widgets = widgets
	},
	LOAD_DATASOURCE (state, datasource) {
		state.datasource = datasource
	},
	load_dataresponce (state, dataresponse) {
		state.dataresponse = dataresponse
	},
	clearSnippetState (state) {
		state.snippet = {
			Id: '',
			Name: '',
			Template: '',
			DataUrl: null,
			Status: '1',
			PreScript: null,
			PostScript: '',
			Css: '',
			Params: null,
			Details: null,
			Category: null,
			Static: '1',
			Timestamp: '',
			_links: {
				self: {
					href: ''
				}
			},
			Placeholder: '',
			Preview: ''
		}
		state.dataresponse = ''
	},
	LOAD_DATA_SOURCE_PARAMS (state, datasourceparams) {
		state.datasourceparams = datasourceparams
	},
	POSTSCRIPT_CONTENT (state, postscriptcontent) {
		state.postscriptcontent = postscriptcontent
	}
}

const actions = {
	clearSnippetState ({ commit }) {
		commit('clearSnippetState')
	},
	updatePostScript ({ commit }, payload) {
		commit('POSTSCRIPT_CONTENT', payload)
	},
	getPostScript ({ commit, dispatch, getters }, payload) {
		delete this._vm.$http.defaults.headers['Authorization']
		delete this._vm.$http.defaults.headers['x-hash']
		axios({
			method: 'POST',
			url: this._vm.FILE_MANAGER,
			withCredentials: true,
			data: {
				action: 'getContent',
				item: '/' + this._vm.USER + '/' + this._vm.PROJECT + '/published/js/' + payload + '_postScript.js'
			}
		}).then((res) => {
			if(res.data.result === null){
				res.data.result = ''
			}
			commit('POSTSCRIPT_CONTENT', res.data.result)
		}).catch((err) => {
			console.log(err)
		})
		this._vm.$http.defaults.headers['Authorization'] = getters.getToken
	},
	createPostScript ({ commit, dispatch, getters }, payload) {
		delete this._vm.$http.defaults.headers['Authorization']
		delete this._vm.$http.defaults.headers['x-hash']
		axios({
			method: 'POST',
			url: this._vm.FILE_MANAGER,
			withCredentials: true,
			data: {
				action: 'create',
				content: payload.PostScriptContent,
				item: '/' + this._vm.USER + '/' + this._vm.PROJECT + '/published/js/' + payload.Name + '_postScript.js'
			}
		}).then((res) => {

		}).catch((err) => {
			console.log(err)
		})
		this._vm.$http.defaults.headers['Authorization'] = getters.getToken
	},
	editPostScript ({ commit, dispatch, getters }, payload) {
		delete this._vm.$http.defaults.headers['Authorization']
		delete this._vm.$http.defaults.headers['x-hash']
		axios({
			method: 'POST',
			url: this._vm.FILE_MANAGER,
			withCredentials: true,
			data: {
				action: 'edit',
				content: payload.PostScriptContent,
				item: '/' + this._vm.USER + '/' + this._vm.PROJECT + '/published/js/' + payload.Name + '_postScript.js'
			}
		}).then((res) => {

		}).catch((err) => {
			console.log(err)
		})
		this._vm.$http.defaults.headers['Authorization'] = getters.getToken
	},
	callExternalApi ({ commit, dispatch, getters }, payload) {
		if(!payload) return;
		axios({
			method: 'GET',
			url: payload
			// withCredentials: true
		}).then((res) => {
			commit('load_dataresponce', JSON.stringify(res.data, null, '   '))
		}).catch((err) => {
			console.log(err)
		})
	},
	// TODO: refactor without regex
	queryDataSourceParams ({ commit, dispatch, getters }, payload) {
		dispatch('callApi', {
			method: 'GET',
			url: '/widget-builder/data-sources/' + payload[0].Id 
		}).then((res) => {
			let s = res.data.Url
			let pattern = /(:[A-Za-z_]+)/g
			let values = payload[1]
			s = s.replace(pattern, '*')
			s = s.split('*')
			let output = ''
			s.forEach(function (part) {
				if (part === '') return
				output += part
				let param = values.pop()
				if (param) output += param
			})
			delete this._vm.$http.defaults.headers['Authorization']
			delete this._vm.$http.defaults.headers['x-hash']
			axios({
				method: res.data.Method,
				url: output,
				withCredentials: true
			}).then((res) => {
				commit('load_dataresponce', JSON.stringify(res.data._embedded, null, '   '))
			}).catch((err) => {
				console.log(err)
			})
			this._vm.$http.defaults.headers['Authorization'] = getters.getToken
		})
		.catch((err) => {
			console.log(err)
		})
	},
	requestData ({ commit, dispatch, getters }, payload) {
		dispatch('callApi', {
			method: 'GET',
			url: '/widget-builder/data-sources/' + payload + '/data-source-params' 
		}).then((resp) => {
			if (resp.data._embedded.widget_data_source_params.length > 0) {
				commit('LOAD_DATA_SOURCE_PARAMS', resp.data._embedded.widget_data_source_params)
			} else {
				dispatch('callApi', {
					method: 'GET',
					url: '/widget-builder/data-sources/' + payload
				}).then((res) => {
					delete this._vm.$http.defaults.headers['Authorization']
					delete this._vm.$http.defaults.headers['x-hash']
					axios({
						method: res.data.Method,
						url: res.data.Url,
						withCredentials: true
					}).then((res) => {
						commit('LOAD_DATA_SOURCE_PARAMS', resp.data._embedded.widget_data_source_params)
						commit('load_dataresponce', JSON.stringify(res.data._embedded, null, '   '))
					}).catch((err) => {
						console.log(err)
					})
					this._vm.$http.defaults.headers['Authorization'] = getters.getToken
				}).catch((err) => {
					console.log(err)
				})
			}
		}).catch((err) => {
			console.log(err)
		})
	},
	deleteSnippet ({ commit, dispatch }, payload) {
		dispatch('callApi', { 
			method: 'DELETE',
			ingoreBaseUrl: true,
			url: this._vm.CMS_BASE_URL + '/cms/snippets/' + payload
		}).then((resp) => {
			dispatch('fetchSnippets')
			commit('Toast/_add', 'Snippet deleted')
		}).catch((err) => {
			console.log(err)
			if(403 == err.response.status){
				commit('Toast/_addError', 'Forbidden (#403) - You are not allowed to perform this action!')
			}else{
				commit('Toast/_addError', 'Failed to delete snippet')
			}
		})
	},
	saveSnippet ({ commit, dispatch, getters }, payload) {
		dispatch('callApi', { 
			method: 'PATCH',
			ingoreBaseUrl: true,
			url: this._vm.CMS_BASE_URL + '/cms/snippets/' + payload.Id,
			data: {
				Id: payload.Id,
				Name: payload.Name,
				Template: payload.Template,
				Category: payload.Category,
				DataUrl: payload.DataUrl,
				Status: payload.Status,
				Static: payload.Static,
				PreScript: payload.PreScript,
				PostScript: payload.PostScript,
				Css: payload.Css,
				Params: payload.Params
			} }).then((resp) => {
			if( null === resp.data.Template ){
				resp.data.Template = ''
			}
			if( null === resp.data.Css ){
				resp.data.Css = ''
			}
			commit('LOAD_SNIPPET', resp.data)
			router.push({ name: 'snippet', params: { id: resp.data.Id } })
			commit('Toast/_add', 'Snippet updated')
		}).catch((err) => {
			console.log(err)
			if(403 == err.response.status){
				commit('Toast/_addError', 'Forbidden (#403) - You are not allowed to perform this action!')
			}else{
				commit('Toast/_addError', 'Failed to load snippet')
			}
			
		})
	},
	updateSnippetTemplate ({ commit }, payload) {
		commit('UPDATE_SNIPPET', payload)
	},
	updateSnippetCSS ({ commit }, payload) {
		commit('UPDATE_SNIPPET_CSS', payload)
	},
	
	createSnippet ({ commit, dispatch, getters }, payload) {
		dispatch('callApi', { 
			method: 'POST',
			ingoreBaseUrl: true,
			url: this._vm.CMS_BASE_URL + '/cms/snippets',
			data: {
				Id: '',
				Name: payload.Name,
				Template: payload.Template,
				Category: payload.Category,
				DataUrl: payload.DataUrl,
				Status: '1',
				Static: '1',
				PreScript: payload.PreScript,
				PostScript: this._vm.PROJECT_BASE_URL + '/published/js/' + payload.Name + '_postScript.js',
				Css: payload.Css,
				Params: payload.Params
			} }).then((resp) => {
			dispatch('createPostScript', payload)
			router.push({ name: 'snippet', params: { id: resp.data.Id } })
			commit('Toast/_add', 'Snippet created')
		}).catch((err) => {
			console.log(err)
			if(403 == err.response.status){
				commit('Toast/_addError', 'Forbidden (#403) - You are not allowed to perform this action!')
			}else{
				commit('Toast/_addError', 'Failed to create snippet')
			}
		})
	},
	toggleSnippetStatus ({ commit, dispatch }, payload) {
		dispatch('callApi', { 
			method: 'PATCH',
			ingoreBaseUrl: true,
			url: this._vm.CMS_BASE_URL + '/cms/snippets/' + payload.Id,
			data: {
				Status: payload.Status
			} }).then((resp) => {
			// commit('LOAD_PAGES', resp.data)
		}).catch((err) => {
			console.log(err)
		})
	},
	loadSnippet ({ commit, dispatch }, snippetid) {
		dispatch('callApi', {
			method: 'GET',
			ingoreBaseUrl: true,
			url: this._vm.CMS_BASE_URL + '/cms/snippets/' + snippetid
		}).then((resp) => {
			if( null === resp.data.Template ){
				resp.data.Template = ''
			}
			if( null === resp.data.Css ){
				resp.data.Css = ''
			}
			commit('LOAD_SNIPPET', resp.data)
			dispatch('getPostScript', resp.data.Name)
			dispatch('callExternalApi', resp.data.DataUrl)
		}).catch((err) => {
			// console.log(err)
			if(403 == err.response.status){
				commit('Toast/_addError', 'Forbidden (#403) - You are not allowed to perform this action!')
			}else{
				commit('Toast/_addError', 'Failed to load snippet')
			}
		})
	},
	fetchSnippets ({ commit, dispatch }) {
		dispatch('callApi', {
			method: 'GET',
			ingoreBaseUrl: true,
			url: this._vm.CMS_BASE_URL + '/cms/snippets'
		}).then((resp) => {
			commit('LOAD_SNIPPETS', resp.data._embedded.snippets)
		}).catch((err) => {
			console.log(err)
			if(403 == err.response.status){
				commit('Toast/_addError', 'Forbidden (#403) - You are not allowed to perform this action!')
			}else{
				commit('Toast/_addError', 'Failed to load snippets')
			}
		})
	},
	fetchWidgets ({ commit, dispatch }) {
		dispatch('callApi', {
			method: 'GET',
			url: '/widget-builder/widgets'
		}).then((resp) => {
			commit('LOAD_WIDGETS', resp.data._embedded.widget_builder)
		}).catch((err) => {
			console.log(err)
		})
	},
	fetchDataSource ({ commit, dispatch }) {
		dispatch('callApi', {
			method: 'GET',
			url: '/widget-builder/data-sources'
		}).then((resp) => {
			commit('LOAD_DATASOURCE', resp.data._embedded.widget_data_sources)
		}).catch((err) => {
			console.log(err)
		})
	}
}

const getters = {
	getSnippets: (state) => {
		return state.snippets
	},
	getSnippet: (state) => {
		return state.snippet
	},
	getWidgets: (state) => {
		return state.widgets
	},
	getDataSource: (state) => {
		return state.datasource
	},
	getDataResponse: (state) => {
		return state.dataresponse
	},
	getDataSourceParams: (state) => {
		return state.datasourceparams
	},
	getPostScriptContent: (state) => {
		return state.postscriptcontent
	}
}

export default {
	state,
	mutations,
	actions,
	getters
}
