<template>
    <div class="component-container">
		<transition name="fade" mode="out-in">
			<div class="modal_wrapper pgb-remove"
				v-if="showFileModal"
				@click="closeFileModal">
				<div class="file-browser__container">
					<FileBrowser />
				</div>
			</div>
		</transition>
		<div class="content">
			<div class="panel-container">
				<div class="meta-header">
					<div class="sidenav-item leftnav" @click.prevent="compileSnippet">
						<font-awesome-icon :icon="['fas', 'rocket']"></font-awesome-icon><p>Compile Code</p>
					</div>
					<!-- <p class="meta-title">Meta Header</p> -->
					<div class="input-holder">
						<label for="">Snippet name</label>
						<input type="text" v-model="snippet.Name" placeholder="Pane name">
					</div>
					<div class="input-holder">
						<label for="">Insert subsnippet</label>
						<div class="input-group">
								<select name="" id="" v-model="selectedSnippet">
									<option v-for="(item, i) in snippets" :key="i" :value="item.Placeholder" @change="onChange">
										{{item.Name}}
									</option>
							</select>
							<button class="btn btn-green" @click.prevent="insertSnippet">Add</button>
						</div>
					</div>
					<!-- <div style="position:absolute; right: 0; top:0;width:500px;height:500px;background:#fbfbfb;z-index: 999; overflow-y:scroll"><pre>{{datasource}}</pre></div> -->
					<div class="input-holder">
						<label for="">Data Source Url - all widgets defined</label>
						<div class="input-group">
								<select @change="queryData(selectedData)" name="" id="" v-model="selectedData">
									<option v-for="(item, i) in datasource" :key="i" :value="item">
										{{item.Name}}
									</option>
							</select>
						</div>
					</div>
					<div class="input-holder">
						<label for="">Import PreSript</label>
						<input type="text" @click="openFileBrowser" v-model="bgImage">
					</div>
					<div class="input-holder">
						<label for="">Import PreSript</label>
						<input type="file" accept=".js">
					</div>
				</div>
				<div class="main-panel" ref="mainpanel" @mousemove="watchhandle($event)" @mouseup="stophandle()" @mouseleave="stophandle()">
					<template v-if="settings === 'split'">
                        <Section ref="left"
							:type="'half'"
							:sec_width="left_sec_width"
							:sec_height="sec_height"
							:value="snippet.Template"
							:lang="'html'"
							@onChangeListener="onChange"
							:insertString="insertString"></Section>
                        <div @mousedown="handle($event)" class="gutter" ref="gutter"></div>
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
									:value="snippet.Template"
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
                    <!-- <template v-if="settings === 'split'">
                        <Section ref="left"
							:type="'half'"
							:sec_width="left_sec_width"
							:sec_height="sec_height"
							:value="snippet.Template"
							:lang="'html'"
							@onChangeListener="onChange"
							:insertString="insertString"></Section>
                        <div @mousedown="handle($event)" class="gutter" ref="gutter"></div>
						<Section ref="left"
							:type="'half'"
							:sec_width="left_sec_width"
							:sec_height="sec_height"
							:value="snippet.Content"
							:lang="'html'"
							@onChangeListener="onChange"
							:insertString="insertString"></Section>
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
                    </template> -->
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import Section from '../components/Section'
import Editor from '../components/Editor'
import FileBrowser from './FileBrowser'
export default {
	components: {
		Editor,
		Section,
		FileBrowser
	},
	data () {
		return {
			bgImage: '',
			// new
			left_sec_width: 0,
			right_sec_width: 0,
			// sec_width: 0,
			sec_height: 0,
			full_width: 0,
			full_height: 0,
			// old
			selectedSnippet: '',
			textOutput: '',
			selectedData: '',
			insertString: '',
			mousemove: false,
			activeTab: false,
			page_tabs: [
				{
					type: 'Snippet Editor',
					editor: 'snippet'
				},
				{
					type: 'Post scripts',
					editor: 'snippet'
				},
				{
					type: 'Data Source',
					editor: 'snippet'
				}
			]
		}
	},
	methods: {
		queryData (val) {

		},
		insertSnippet () {
			return this.insertString = this.selectedSnippet
		},
		onChange (val) {
			this.snippet.Template = val
		},
		onChangeHTMLSnippet (val) {
			this.snippet.Template = val
		},
		onChangeJavascript (val) {
			// this.snippetTemplate = val;
		},
		onChangeJson (val) {

		},
		hndFileSelect (path) {
			this.depend = this.$UPLOAD_PATH + path
		},
		closeFileModal () {
			this.$store.commit('CLOSE_FILEMENU')
		},
		openFileBrowser () {
			this.$store.commit('OPEN_FILEMENU', this)
		},
		addSubSnippet (val) {
			console.log(this.selectedSnippet)
			return this.selectedSnippet
		},
		compileSnippet () {
			this.$store.dispatch('saveSnippet', this.snippet)
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
		showFileModal () {
			return this.$store.getters.fileModalOpen
		},
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
		let snippetid = this.$route.params.id
		if (snippetid.length > 0) {
			this.$store.dispatch('loadSnippet', this.$route.params.id)
		}
	}
}
</script>
<style lang="scss">

</style>
