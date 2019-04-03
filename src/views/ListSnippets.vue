<template>
	<div>
		<div class="heading">
			<p>Snippets</p>
			<router-link tag="button" class="btn btn-green" :to="{ name: 'new', params: {type: 'snippet'}}">
				New Snippet
			</router-link>
		</div>
		<div class="content" style="height:calc(100% - 42px)">
			<table class="list" cellpadding="0" cellspacing="0" width="100%">
				<thead class="list-heading">
					<tr>
						<th>
							<button class="btn btn-icon" @click="sortbyindex()">
								Id
							</button>
						</th>
						<th>
							<button class="btn btn-icon" @click="sortbyname()">
								Name
							</button>
						</th>
						<th>
							<button class="btn btn-icon">
								Placeholder
							</button>
						</th>
						<th align="center"><p>Status</p></th>
						<th align="center"><p>Actions</p></th>
					</tr>
				</thead>
				<tr v-for="(item, i) in snippets"
				:key="i"
				class="list-item">
					<td class="list-item-id"><p>{{item.Id}}</p></td>
					<td class="list-item-grow">
						<router-link tag="button" class="btn btn-icon" :to="{name: 'snippet', params: { id: item.Id }}">
							{{item.Name}}
						</router-link>
					</td>
					<td class="list-item-grow"><p>{{item.Placeholder}}</p></td>
					<td class="list-item-action">
						<div class="togglecheckbox">
							<span :class="['toggle-icon', item.Status == 1 ? 'checked' : '']" @click="toggleicon(item)"></span>
						</div>
					</td>
					<td class="list-item-action">
						<router-link tag="button" class="btn btn-icon" :to="{name: 'snippet', params: { id: item.Id }}">
							<font-awesome-icon :icon="['far', 'edit']"></font-awesome-icon>
						</router-link>
						<button class="btn btn-icon" @click.prevent="askModalDeleteSnippet(item)">
							<font-awesome-icon :icon="['far', 'trash-alt']"></font-awesome-icon>
						</button>
					</td>
				</tr>
			</table>
			<transition name="fade" mode="out-in">
				<div v-if="activeModal" @click.self="closemodal($event)" class="full-screen-wrapper">
					<Modal @modalResponse="modalResponse" :note="note" :message="message"></Modal>
				</div>
			</transition>
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
			active: false,
			activeModal: false,
			message: '',
			note: ''
		}
	},
	methods: {
		modalResponse (val) {
			if (val.resp === true) {
				this.$store.dispatch('deleteSnippet', val.note)
				this.activeModal = false
			} else {
				this.activeModal = false
			}
		},
		closemodal (e) {
			e.stopPropagation()
			this.activeModal = false
		},
		askModalDeleteSnippet (item) {
			this.message = 'Delete Snippet ' + item.Name + ' ?'
			this.note = item.Id
			this.activeModal = true
		},
		deleteSnippet (id) {
			this.$store.dispatch('deleteSnippet', id)
		},
		sort (value) {

		},
		toggle (value) {

		},
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
			this.$store.dispatch('toggleSnippetStatus', payload)
			val.Status = newstatus;
		}
	},
	computed: {
		snippets: {
			get () {
				return this.$store.getters.getSnippets
			},
			set () {

			}
		}
	},
	created() {
		this.$store.dispatch('fetchSnippets')
	}
}
</script>
<style lang="scss">
</style>
