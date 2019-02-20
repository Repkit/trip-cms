import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

// Font awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faVuejs } from '@fortawesome/free-brands-svg-icons'
import { faToggleOn, faToggleOff, faAngleLeft, faAngleRight, faTimes, faSort,
	faSortDown, faSortUp, faSlidersH, faRocket, faSignOutAlt, faFileUpload } from '@fortawesome/free-solid-svg-icons'
import { faUserCircle, faFileAlt, faFileCode, faEdit, faTrashAlt, faPlayCircle, faSave
} from '@fortawesome/free-regular-svg-icons'
library.add(faUserCircle, faFileAlt, faFileCode, faVuejs, faEdit, faTrashAlt, faToggleOn, faToggleOff, faAngleLeft,
	faAngleRight, faTimes, faSort, faSortDown, faSortUp, faPlayCircle, faSave, faSlidersH, faRocket, faSignOutAlt,
	faFileUpload)
Vue.component('font-awesome-icon', FontAwesomeIcon)


// axios.defaults.prefix = '' // prevent axios to prepend '/' to baseUrl
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.headers['Accept'] = 'application/json, text/javascript, */*;'
axios.defaults.transformRequest = function (data, headers) {
	const serializedData = []
	for (const k in data) {
		if (data[k]) {
			serializedData.push(`${k}=${encodeURIComponent(data[k])}`)
		} else {
			serializedData.push(`${k}=${data[k]}`)
		}
	}
	return serializedData.join('&')
}
Vue.prototype.$http = axios

axios({
	method: 'GET',
	url: 'config.json'
}).then((res) => {
	Object.keys(res.data).forEach((key) => {
		Vue.prototype[key] = res.data[key]
	})
	new Vue({
		router,
		store,
		render: h => h(App)
	}).$mount('#app')
})

/* let AUTH_URL = 'http://192.168.0.30/dynapack-authentication/hash.php'
let BASE_URL = 'http://192.168.0.30/dynapack/clients/bitusi/public/index.php'
let API_BASE_URL = 'http://192.168.0.30/dynapack/clients/bitusi/public/api.php'
let PROJECT_BASE_URL = 'http://192.168.0.30/dynapack/clients/bitusi/public/index.php' */
// set axios on $http from Vue instance
Vue.config.productionTip = false
