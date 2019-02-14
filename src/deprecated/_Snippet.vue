<template>
	<div class="component-container">
		<div class="content">
			<div class="panel-container">
				<div class="meta-header">
					<p class="meta-title">Meta Header</p>
					<form action="">
						<div class="input-holder">
							<input type="text" v-model="snippet.Name" placeholder="Snippet name">
						</div>
						<div class="input-holder">
							<input type="text" v-model="snippet.Category" placeholder="Snippet category">
						</div>
						<div class="input-holder">
							<label for="">Load widgets</label>
							<div class="input-group">
									<select name="" id="" v-model="selectedWidget" >
									<option :value="item.Name" @change="onChange" v-for="(item, i) in widgets" :key="i">
										{{item.Name}}
									</option>
								</select>
								<button class="btn btn-green" @click.prevent="insert">Add</button>
							</div>
							<label for="">Insert subsnippet</label>
							<div class="input-group">
									<select name="" id="" v-model="selectedSnippet">
										<optgroup :label="item.Category" v-for="(item, i) in snippets" :key="i">
											<option :value="item.Placeholder" @change="onChange">
												{{item.Name}}
											</option>
										</optgroup>
								</select>
								<button class="btn btn-green" @click.prevent="insertSnippet">Add</button>
							</div>
						</div>
					</form>
				</div>
				<div class="main-panel" ref="mainpanel" @mousemove="watchhandle($event)" @mouseup="stophandle()" @mouseleave="stophandle()">
					<pre><p>{{datasource}}</p></pre>
					<template v-if="settings === 'split'">
						<div class="section-h" ref="left">
							<Editor
								:name="'edit_snippet'"
								:lang="'html'"
								:theme="'tomorrow_night'"
								:value="snippet.Template"
								:fontsize="13"
								:width="leftwidth"
								:height="leftheight"
								:onInsert="insertString"
								:onChange="onChange">
							</Editor>
						</div>
						<div @mousedown="handle($event)" class="gutter" ref="gutter"></div>
						<div class="section-h" ref="right">
							<div class="section-v" ref="top" @mousemove="watchhandlev($event)" @mouseleave="stophandlev()">
								<Editor
									:name="'edit_js'"
									:lang="'html'"
									:theme="'tomorrow_night'"
									:value="'adsasdasd'"
									:fontsize="13"
									:width="rightwidth"
									:height="topheight"
									:onInsert="insertString"
									:onChange="onChange">
								</Editor>
							</div>
							<div @mousedown="handlev($event)" class="gutter-v" ref="gutterv"></div>
							<div class="section-v" ref="bottom">
								<Editor
									:name="'edit_json'"
									:lang="'html'"
									:theme="'tomorrow_night'"
									:value="'adsasdasd'"
									:fontsize="13"
									:width="rightwidth"
									:height="botheight"
									:onInsert="insertString"
									:onChange="onChange">
								</Editor>
							</div>
						</div>
					</template>
					<template v-else-if="settings === 'tabs'">
						<div class="tabs_container">
							<div class="editor_tabs">
								<div class="editor_tabs_item" @click="toggletab(i)" v-for="(item, i) in page_tabs" :key="i">{{item.type}}</div>
							</div>
							<div class="editor_tabs_content">
								<div class="section-full" v-if="activeTab == 0">

								</div>
								<div class="section-full " v-else-if="activeTab == 1">

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
import Editor from '../components/Editor'
export default {
	components: {
		Editor
	},
	data () {
		return {
			selectApi: '',
			selectedWidget: 'Widgets',
			rightwidth: 0,
			leftwidth: 500,
			leftheight: 500,
			topheight: 500,
			botheight: 500,
			insertString: '',
			selectedSnippet: 'Snippet list',
			activeTab: false,
			gutter: {},
			mousemove: false,
			page_tabs: [
				{
					type: 'Snippet Editor',
					editor: 'snippet'
				},
				{
					type: 'Dependencies',
					editor: 'dependencies'
				}
			]
		}
	},
	methods: {
		texttosend () {
			return this.selectedSnippet
		},
		insert (val) {
			this.texttosend
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
			this.$store.dispatch('savePage', this.snippet)
		},
		addHeadSnippet () {

		},
		toggletab (i) {
			this.activeTab = i
		},
		onChange (val) {
			// console.log('change',val);
			this.snippet.Template = val
		},
		onChangeRight (val) {

		},
		handle (e) {
			this.gutter = e.target
			if (e.target === this.gutter) {
				this.mousemove = true
			}
		},
		handlev (e) {
			this.gutter = e.target
			if (e.target === this.gutter) {
				this.mousemove = true
			}
		},
		resizeSiblings (panels, e) {
			let left = this.$refs.left
			let right = this.$refs.right
			const panelwidth = Math.round(this.$refs.mainpanel.offsetWidth / panels.length)
			let cursposPos = e.clientX - left.offsetLeft
			left.style.width = Math.max(140, (cursposPos - 1)) + 'px'
			left.style.maxWidth = ((window.innerWidth - 379) - 7) + 'px'
			left.style.flexGrow = 0
			this.rightwidth = (((window.innerWidth - 7) - 239) - left.offsetWidth)
			right.style.width = this.rightwidth + 'px'
			this.leftwidth = left.offsetWidth
			this.leftheight = left.offsetHeight

			let top = this.$refs.top
			let bot = this.$refs.bottom
			top.style.width = this.rightwidth + 'px'
			bot.style.width = this.rightwidth + 'px'
		},
		resizeSiblingsv (panels, e) {

		},
		watchhandle (e) {
			if (this.mousemove == false) {
				return false
			}
			let panels = this.$el.querySelectorAll('.section-h')
			this.resizeSiblings(panels, e)
		},
		watchhandlev (e) {
			if (this.mousemove == false) {
				return false
			}
			let panels = this.$el.querySelectorAll('.section-v')
			this.resizeSiblingsv(panels, e)
		},
		stophandle () {
			this.mousemove = false
		},
		stophandlev () {
			this.mousemove = false
		}
	},
	watch: {
		'width': function (val) {
			// console.log(this.$refs.main.offsetWidth);
		},
		'height': function (val) {

		}
	},
	mounted () {
		this.leftwidth = (this.$refs.mainpanel.offsetWidth / 2)
		this.leftheight = this.$refs.mainpanel.offsetHeight
		let panels = this.$el.querySelectorAll('.section-h')
		panels.forEach((el) => {
			el.style.width = (this.$refs.mainpanel.offsetWidth / 2) - 1 + 'px'
			el.style.height = this.$refs.mainpanel.offsetHeight + 'px'
		})

		let childpanels = this.$el.querySelectorAll('.section-v')
		childpanels.forEach((el) => {
			el.style.width = (this.$refs.mainpanel.offsetWidth / 2) + 'px'
			el.style.height = (this.$refs.mainpanel.offsetHeight / 2) - 1 + 'px'
		})

		this.rightwidth = this.$refs.right.offsetWidth
		this.topheight = (this.$refs.right.offsetHeight / 2) - 1
		this.botheight = (this.$refs.right.offsetHeight / 2) - 1
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
		let snippetid = this.$route.params.id
		if (snippetid.length > 0) {
			this.$store.dispatch('loadSnippet', this.$route.params.id)
		}
	}
}
</script>
<style lang="scss">
</style>
