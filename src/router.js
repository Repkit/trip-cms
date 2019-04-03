import Vue from 'vue'
import Router from 'vue-router'
import Store from './store'
import Dashboard from './views/Dashboard.vue'
import Login from './views/Login.vue'
import Page from './views/Page.vue'
import Snippet from './views/Snippet.vue'
import ListPages from './views/ListPages.vue'
import ListSnippets from './views/ListSnippets.vue'
import New from './views/New.vue'

Vue.use(Router)

const router = new Router({
	// mode: 'history',
	base: Vue.PROJECT_BASE_URL,
	routes: [
		{
			path: '/login',
			name: 'login',
			component: Login
		},
		{
			path: '/',
			name: 'dashboard',
			component: Dashboard,
			children: [
				{
					path: '',
					name: 'pages',
					component: ListPages
				},
				{
					path: 'snippets',
					name: 'snippets',
					component: ListSnippets
				},
				{
					path: 'page/:id',
					name: 'page',
					component: Page
				},
				{
					path: 'snippet/:id',
					name: 'snippet',
					component: Snippet
				},
				/*{
					path: 'email-templates',
					name: 'email-templates',
					component: ListSnippets //ListEmailTemplates
				},
				{
					path: 'email-template/:id',
					name: 'email-template',
					component: Snippet //EmailTemplate
				},*/
				{
					path: 'new/:type',
					name: 'new',
					component: New
				}
			]
		}
	]
})

router.beforeEach((to, from, next) => {
	const toLoginPage = to.name === 'login'
	if (Store.getters.isLoginRequired && Store.getters.isLoggedIn) {
		toLoginPage ? next('/') : next()
	} else {
		const userId = Store.getters.getCookie('userId')
		const token = Store.getters.getCookie('token')

		if (userId && token) {
			Store.dispatch('checkUserSessionServer', { userId, token }).then(response => {
				if (response) {
					toLoginPage ? next('/') : next()
				} else {
					toLoginPage ? next() : next('/login')
				}
			})
		} else {
			toLoginPage ? next() : next('/login')
		}
	}
})

export default router
