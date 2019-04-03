<template>
	<div class="component-container">
		<div class="heading">
			<p>Email Templates</p>
			<router-link tag="button" class="btn btn-green" :to="{ name: 'new', params: {type: 'email'}}">
				New Email Template
			</router-link>
			<!--<form @submit.prevent="search(filterQuery)">-->
			<!--	<input type="text" class="search-input" v-model="filterQuery" placeholder="Search Page Name">-->
			<!--	<input type="submit" hidden>-->
			<!--</form>-->

		</div>
		<div class="content" ref="content" style="height:calc(100% - 42px)">
			<table class="list" cellpadding="0" cellspacing="0" width="100%">
				<thead class="list-heading">
					<tr>
						<th align="center"><p>Id</p></th>
						<th><button class="btn btn-icon">Name</button></th>
						<th align="center"><p>Status</p></th>
						<th align="center"><p>Actions</p></th>
					</tr>
				</thead>
				<tr v-for="(item, i) in emails"
				:key="i"
				class="list-item">
					<td class="list-item-id"><p>{{item.Id}}</p></td>
					<td class="list-item-grow">
						<router-link tag="button" class="btn btn-icon" :to="{name: 'email-template', params: { id: item.Id }}">
							{{item.Name}}
						</router-link>
					</td>
					<td class="list-item-action">
						<div class="togglecheckbox">
							<span :class="['toggle-icon', item.Status == 1 ? 'checked' : '']" @click="toggleicon(item)"></span>
						</div>
					</td>
					<td class="list-item-action">
						<router-link tag="button" class="btn btn-icon" :to="{name: 'email-template', params: { id: item.Id }}">
							<font-awesome-icon :icon="['far', 'edit']"></font-awesome-icon>
						</router-link>
						<!--<button class="btn btn-icon" @click.prevent="askModalDeleteEmail(item)">-->
						<!--	<font-awesome-icon :icon="['far', 'trash-alt']"></font-awesome-icon>-->
						<!--</button>-->
					</td>
				</tr>
			</table>
			<!--<transition name="fade" mode="out-in">-->
			<!--	<div v-if="activeModal" @click.self="closemodal($event)" class="full-screen-wrapper">-->
			<!--		<Modal @modalResponse="modalResponse" :note="note" :message="message"></Modal>-->
			<!--	</div>-->
			<!--</transition>-->
		</div>
	</div>
</template>
<script>
import Modal from '../components/Modal.vue'
export default {
	components: {
		Modal
	},
	data () {
		return {
			index: 0,
			// active: false,
			// modal
			// filterQuery: '',
			// activeModal: false,
			// message: '',
			// note: '',
			// activeindex: false,
			// activename: false,
			pagei: 0,
			// sorting: ['sort-down', 'sort-up']
		}
	},
	mounted () {
		this.$refs.content.offsetWidth
	},
	methods: {
		/*search(val) {
			if (val.length > 0) {
				this.$store.dispatch('searchPages', val)
			} else {
				this.$store.dispatch('fetchPages')
			}
		},
		modalResponse (val) {
			if (val.resp === true) {
				this.$store.dispatch('deletePage', val.note)
				this.activeModal = false
			} else {
				this.activeModal = false
			}
		},
		closemodal (e) {
			e.stopPropagation()
			this.activeModal = false
		},
		askModalDeletePage (item) {
			this.message = 'Delete Page ' + item.Name + ' ?'
			this.note = item.Id
			this.activeModal = true
		},
		deletePage (id) {
			this.$store.dispatch('deletePage', id)
		},
		loadPage (id) {

		},
		sortbyindex () {
			this.activeindex = !this.activeindex
		},
		sortbyname () {
			this.activename = !this.activename
		},
		sort (index) {

		},
		toggle (value) {

		},*/
		toggleicon (val) {
			let newstatus
			if (val.Status === '1') {
				newstatus = '0'
			} else {
				newstatus = '1'
			}
			let payload = {
				Id: val.Id,
				Status: newstatus,
			}
			this.$store.dispatch('toggleEmailStatus', payload)
			val.Status = newstatus;
		}
	},
	computed: {
		emails () {
			return this.$store.getters.getEmails
		}

	},
	created() {
		this.$store.dispatch('fetchEmails')
	}
}
</script>
<style lang="scss">
</style>
