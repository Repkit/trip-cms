<template>
	<div class="component-container">
<!-- 		<div class="heading">
			<p>{{page.Name}}</p>
			<button class="btn btn-icon" @click.prevent="compilePage()">
				<font-awesome-icon :icon="['far', 'play-circle']"></font-awesome-icon>
				Compile
			</button>
			<button class="btn btn-icon" @click.prevent="savePage">
				<font-awesome-icon :icon="['far', 'save']"></font-awesome-icon>
				Save
			</button>
		</div> -->
		<div class="content">
			<div class="panel-container" ref="panelcontainer">
				<div class="meta-header">
					<p class="meta-title">Page settings</p>
					<form action="">
						<div class="input-holder">
							<label for="">Page name</label>
							<input type="text" v-model="page.Name" placeholder="Pane name">
						</div>
						<div class="input-holder">
							<label for="">Head snippet</label>
							<div class="input-group">
									<select name="" id="">
									<option value="" :v-model="item.Name" @change="onChange" v-for="(item, i) in headSnippets" :key="i">
										{{item.Name}}
									</option>
								</select>
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
					<div class="section-h" ref="left">
						<Editor
							:name="'edit_page'"
							:lang="'html'"
							:theme="'tomorrow_night'"
							:value="page.Content"
							:fontsize="13"
							:width="leftwidth"
							:height="leftheight"
							:onInsert="insertString"
							:onChange="onChange">
						</Editor>
					</div>
					<div @mousedown="handle($event)" class="gutter" ref="gutter"></div>
					<div class="section-h render" ref="right">
						<div class="render-width">{{renderwidth}}px</div>
						<!-- <iframe width="100%" height="100%" sandbox="allow-forms allow-scripts allow-same-origin allow-modals allow-popups" allowfullscreen
						:src="page._links['page-url'].href" frameborder="0"></iframe> -->
					</div>
					<!-- <template v-else-if="settings === 'tabs'">
						<div class="tabs_container">
							<div class="editor_tabs">
								<div class="editor_tabs_item" :class="{active: activeTab == i}" @click="toggletab(i)" v-for="(item, i) in page_tabs" :key="i">{{item.type}}</div>
							</div>
							<div class="editor_tabs_content">
								<div class="section-full" v-if="activeTab == 0">
								</div>
								<div class="section-full render" v-else-if="activeTab == 1">
									<iframe width="100%" height="100%" sandbox="allow-forms allow-scripts allow-same-origin allow-modals allow-popups" allowfullscreen
									:src="page._links['page-url'].href" frameborder="0"></iframe>
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
import Editor from '../components/Editor'
export default {
	components: {
		Editor
	},
	data () {
		return {
			rightwidth: 0,
			leftwidth: 500,
			leftheight: 500,
			insertString: '',
			selectedSnippet: 'Snippet list',
			renderwidth: 0,
			activeTab: false,
			gutter: {},
			mousemove: false,
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
		insertSnippet () {
			this.insertString = this.selectedSnippet
		},
		compilePage () {
			this.$store.dispatch('savePage', this.page)
		},
		addHeadSnippet () {

		},
		toggletab (i) {
			this.activeTab = i
		},
		onChange (val) {
			this.page.Content = val
		},
		handle (e) {
			this.gutter = e.target
			if (e.target === this.gutter) {
				this.mousemove = true
			}
		},
		resizeSiblings (gutter, e, panels) {
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
		},
		watchhandle (e) {
			if (this.mousemove == false) {
				return false
			}
			let panels = this.$el.querySelectorAll('.section-h')
			let gutter = this.gutter
			this.resizeSiblings(gutter, e, panels)
		},
		stophandle () {
			this.mousemove = false
		},
		filterSnippets () {
			this.snippets.forEach((item) => {
				item.Category
			})
		}
	},
	watch: {
		'rightwidth': function (val) {
			this.renderwidth = val
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
		this.renderwidth = this.$refs.right.offsetWidth
		this.filterSnippets
	},
	computed: {
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
		this.$store.dispatch('loadPage', this.$route.params.id)
	}
}
</script>
<style lang="scss">

</style>
