<template>
    <div class="component-container">
		<div class="content">
			<div class="panel-container">
				<div class="meta-header">
					<form @submit.prevent="compilePage">
					<button type="submit" class="submit-styled">
						<font-awesome-icon :icon="['fas', 'rocket']"></font-awesome-icon><p>Publish Page</p>
					</button>
						<div class="input-holder">
							<label for="">Page name *</label>
							<input type="text" required v-model="page.Name" placeholder="Page name">
						</div>
						<div class="input-holder">
							<label for="">Head snippet</label>
							<div class="input-group">
									<select name="" id="" :v-model="pageHead">
									<option value="" disabled selected hidden>Chose Header Snippet</option>
									<option value="">No Header</option>
									<option value="" v-for="(item, i) in headSnippets" :key="i">
										{{item.Name}}
									</option>
								</select>
							</div>
							<label for="">Insert subsnippet</label>
							<div class="input-group">
									<select name="" id="" v-model="selectedSnippet">
										<option value="" disabled selected hidden>Select a Snippet</option>
										<option v-for="(item, i) in snippets" :key="i" :value="item.Placeholder">
											{{item.Name}}
										</option>
								</select>
								<button class="btn btn-green" @click.prevent="insertSnippet">Add</button>
							</div>
						</div>
						<div class="input-holder">
							<label>Full Page</label>
							<div class="togglecheckbox" style="justify-content: flex-start">
								<span id="dyamic" :class="['toggle-icon', isFullPage ? 'checked' : '']" @click="toggleStaus"></span>
								<label class="label-text" for="dyamic" @click="toggleStaus">Full Page</label>
							</div>
						</div>
					</form>
				</div>
				<div class="main-panel" ref="mainpanel" @mousemove="watchhandle($event)" @mouseup="stophandle()" @mouseleave="stophandle()">
                    <template v-if="settings === 'split'">
                        <Section ref="left"
						:type="'half'"
						:sec_width="left_sec_width"
						:sec_height="sec_height"
						:value="page.Content"
						:lang="'html'"
						@onChangeListener="onChange"
						:insertString="insertString"></Section>
                        <div @mousedown="handle($event)" class="gutter" ref="gutter"></div>
						<Section ref="left" :type="'render'" :sec_width="right_sec_width" :sec_height="sec_height" :value="page._links['page-url'].href"></Section>
                        <!-- <Section ref="right" :type="'split'" :sec_width="right_sec_width" :sec_height="sec_height" :value="'Stringoftext'" :toplang="'javascript'" :botlang="'json'"></Section> -->
                    </template>
                    <template v-if="settings === 'tabs'">
                        <div class="tabs_container">
							<div class="editor_tabs">
								<div class="editor_tabs_item" :class="{active: activeTab == i}" @click="toggletab(i)" v-for="(item, i) in page_tabs" :key="i"><p>{{item.type}}</p></div>
							</div>
							<div class="editor_tabs_content">
								<div class="section-full" v-if="activeTab == 0">
									<Section ref="left"
									:type="'full'"
									:sec_width="full_width"
									:sec_height="full_height"
									:value="page.Content"
									:lang="'html'"
									@onChangeListener="onChange"
									:insertString="insertString"></Section>
								</div>
								<div class="section-full " v-else-if="activeTab == 1">
									<Section ref="left" :type="'render'" :sec_width="full_width" :sec_height="full_height" :value="page._links['page-url'].href"></Section>
								</div>
							</div>
						</div>
                    </template>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import Section from '../components/Section'
export default {
	components: {
		Section
	},
	data () {
		return {
			// new
			left_sec_width: 0,
			right_sec_width: 0,
			// sec_width: 0,
			sec_height: 0,
			full_width: 0,
			full_height: 0,
			// old
			pageHead: '',
			isFullPage: false,
			selectedSnippet: '',
			insertString: '',
			mousemove: false,
			activeTab: false,
			page_tabs: [
				{
					type: 'PageEditor',
					editor: 'page'
				},
				{
					type: 'Render',
					editor: 'page_render'
				}
			]
		}
	},
	methods: {
		toggleStaus() {
			this.isFullPage = !this.isFullPage;
			if (this.isFullPage) {
				this.page.FullPage = '1';
			} else {
				this.page.FullPage = '0';
			}
		},
		insertSnippet () {
			return this.insertString = this.selectedSnippet
		},
		onChange (val) {
			this.page.Content = val
			this.selectedSnippet = ''
		},
		hndFileSelect (path) {
			this.depend = this.$UPLOAD_PATH + path
		},
		openFileBrowser () {
			this.$store.commit('OPEN_FILEMENU', this)
		},
		addSubSnippet (val) {
			console.log(this.selectedSnippet)
			return this.selectedSnippet
		},
		compilePage () {
			this.$store.dispatch('savePage', this.page)
		},
		addHeadSnippet () {

		},
		toggletab (i) {
			this.activeTab = i
		},
		handle (e) {
			this.gutter = e.target
			if (e.target === this.gutter) {
				this.mousemove = true
			}
		},
		resizeSiblings (e) {
			let cursposPos = e.clientX - 239
			this.left_sec_width = Math.ceil(Math.max(140, (cursposPos - 1)))
			this.right_sec_width = (((window.innerWidth - 1) - 239) - this.left_sec_width)
		},
		watchhandle (e) {
			if (this.mousemove === false) {
				return false
			}
			this.resizeSiblings(e)
		},
		stophandle () {
			this.mousemove = false
		}
	},
	watch: {
		'page': function (val) {

		},
		'page.FullPage' : function(val) {
			if (val === '1') {
				this.isFullPage = true;
			}
		}
	},
	mounted () {
		const mainWidth = window.innerWidth - 240
		const mainHeight = window.innerHeight - 56
		this.left_sec_width = Math.ceil(mainWidth / 2)
		this.right_sec_width = Math.ceil(mainWidth / 2)
		this.sec_height = (mainHeight)
		this.full_width = mainWidth - 1
		this.full_height = mainHeight - 47
	},
	computed: {
		settings () {
			return this.$store.getters.getMode
		},
		page () {
			return this.$store.getters.getPage
		},
		snippets () {
			return this.$store.getters.getSnippets
		},
		headSnippets () {
			return this.snippets.filter((elem) => {
				return elem.Category === 'Head'
			})
		},
		widgets () {
			return this.$store.getters.getWidgets
		}
	},
	beforeMount () {
		let pageid = this.$route.params.id
		if (pageid.length > 0) {
			this.$store.dispatch('loadPage', this.$route.params.id)
		}
	}
}
</script>
<style lang="scss">

</style>
