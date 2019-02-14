import Vue from 'vue'
import Vuex from 'vuex'
import Api from './modules/Api'
import SessionService from './modules/SessionService'
import GetPages from './modules/GetPages'
import GetSnippets from './modules/GetSnippets'
import Page from './modules/Page'
import Snippet from './modules/Snippet'
import EditorSettings from './modules/EditorSettings'
import FileBrowser from './modules/FileBrowser'
import Toast from './modules/Toast'
import UserState from './modules/UserState'

Vue.use(Vuex)

export default new Vuex.Store({
	mutations: {
		SET_COOKIE ({}, payload) {
			let newCookie = payload.name + '=' + payload.value
			if (payload.expireTime) {
				newCookie += ';max-age=' + payload.expireTime // set expire date
			}
			document.cookie = newCookie
		},
		CLEAR_ALL_COOKIES () {
			document.cookie.split(';').forEach((cookie) => {
				const key = cookie.split('=')
				document.cookie = key[0] + ' =; expires = Thu, 01 Jan 1970 00:00:00 UTC'
			})
		}
	},
	getters: {
		getCookie ({}, name) {
			// returns a function so it can be called with params
			return (name) => {
				return document.cookie.length > 0 && document.cookie.includes(name + '=') ? document.cookie.split(name + '=')[1].split(';')[0] : false // get cookie value
			}
		}
	},
	modules: {
		Api,
		SessionService,
		GetPages,
		GetSnippets,
		Page,
		Snippet,
		EditorSettings,
		FileBrowser,
		Toast,
		UserState
	}
})
