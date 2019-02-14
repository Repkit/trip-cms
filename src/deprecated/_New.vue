<template>
    <div class="component-container">
		<div class="content">
			<div class="panel-container">
				<div class="meta-header">
					<p class="meta-title">Meta Header</p>
				</div>
				<div class="main-panel" ref="mainpanel" @mousemove="watchhandle($event)" @mouseup="stophandle()" @mouseleave="stophandle()">
                    <template v-if="settings === 'split'">
                        <Section ref="left" :type="'half'" :sec_width="left_sec_width" :sec_height="sec_height" :value="'Stringoftext'" :lang="'html'"></Section>
                        <div @mousedown="handle($event)" class="gutter" ref="gutter"></div>
                        <Section ref="right" :type="'split'" :sec_width="right_sec_width" :sec_height="sec_height" :value="'Stringoftext'" :toplang="'javascript'" :botlang="'json'"></Section>
                    </template>
                    <template v-if="settings === 'tabs'">
                        <div class="tabs_container">
							<div class="editor_tabs">
								<div class="editor_tabs_item" :class="{active: activeTab == i}" @click="toggletab(i)" v-for="(item, i) in page_tabs" :key="i"><p>{{item.type}}</p></div>
							</div>
							<div class="editor_tabs_content">
								<div class="section-full" v-if="activeTab == 0">
									<Section ref="left" :type="'full'" :sec_width="full_width" :sec_height="full_height" :value="'Stringoftext'" :lang="'html'"></Section>
								</div>
								<div class="section-full " v-else-if="activeTab == 1">
									<Section ref="left" :type="'full'" :sec_width="full_width" :sec_height="full_height" :value="'Stringoftext'" :lang="'html'"></Section>
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
import Editor from '../components/Editor'
export default {
	components: {
		Editor,
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
			this.$store.dispatch('savePage', this.snippet)
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
			let left = this.$refs.left
			let right = this.$refs.right
			let cursposPos = e.clientX - 239
			this.left_sec_width = Math.ceil(Math.max(140, (cursposPos - 1)))
			this.right_sec_width = (((window.innerWidth - 1) - 239) - this.left_sec_width)
		},
		watchhandle (e) {
			if (this.mousemove == false) {
				return false
			}
			this.resizeSiblings(e)
		},
		stophandle () {
			this.mousemove = false
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
		datasource () {
			return this.$store.getters.getDataSource
		},
		settings () {
			return this.$store.getters.getMode
		},
		snippet () {
			return this.$store.getters.getSnippet
		},
		snippets () {
			return this.$store.getters.getSnippets
		},
		widgets () {
			return this.$store.getters.getWidgets
		}
	},
	beforeMount () {
		/* let snippetid = this.$route.params.id;
		if (snippetid.length > 0) {
			this.$store.dispatch('loadSnippet', this.$route.params.id);
		} */
	}
}
</script>
<style lang="scss">

</style>
