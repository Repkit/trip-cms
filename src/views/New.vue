<template>
	<div class="component-container">
		<div class="content">
			<div class="panel-container">
				<template v-if="type === 'page'">
					<div class="meta-header">
						<form @submit.prevent="SavePage">
						<button type="submit" class="submit-styled">
							<font-awesome-icon :icon="['fas', 'rocket']"></font-awesome-icon><p>Publish Page</p>
						</button>
						<!-- <p class="meta-title">Meta Header</p> -->
							<div class="input-holder">
								<label for="">Page name *</label>
								<input type="text" required v-model="pageName" placeholder="Page name">
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
											<option value="" disabled selected hidden>Chose Snippet</option>
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
					<div class="main-panel" ref="mainpanel">
						<template v-if="settings === 'split'">
							<Section ref="left"
							:type="'half'"
							:sec_width="full_width"
							:sec_height="full_height"
							:value="pageContent"
							:lang="'html'"
							@onChangeListener="onChangeHTMLPage"
							:insertString="insertString"></Section>
							<!-- <div @mousedown="handle($event)" class="gutter" ref="gutter"></div> -->
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
										:sec_height="full_height - 47"
										:value="pageContent"
										:lang="'html'"
										@onChangeListener="onChangeHTMLPage"
										:insertString="insertString"></Section>
									</div>
									<div class="section-full " v-else-if="activeTab == 1">
										<Section ref="left" :type="'render'" :sec_width="full_width" :sec_height="full_height" :value="page._links['page-url'].href"></Section>
									</div>
								</div>
							</div>
						</template>
					</div>
				</template>
				<template v-else>
					<div class="meta-header">
						<form @submit.prevent="saveSnippet">
							<button type="submit" class="submit-styled">
								<font-awesome-icon :icon="['fas', 'rocket']"></font-awesome-icon><p>Compile Code</p>
							</button>
							<div class="input-holder">
								<label for="">Snippet name *</label>
								<input type="text" required v-model="snippetName" placeholder="Snippet name">
							</div>
							<div class="input-holder">
								<label for="">Category *</label>
								<input type="text" required v-model="snippetCategory" placeholder="Snippet category">
							</div>
							<div class="input-holder">
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
								<label for="">Data source type predefined</label>
								<div class="input-group">
										<select name="" @change="datatypeselect($event)" id="" v-model="datatype" ref="datatypesSelect">
											<option value="" disabled selected hidden>Please Choose Datasource</option>
											<option  v-for="(item, i) in datatypes" :key="i" :value="item.Id">
												{{item.Name}}
											</option>
									</select>
								</div>
							</div>
							<div class="input-holder">
								<label>Dynamic snippet</label>
								<div class="togglecheckbox" style="justify-content: flex-start">
									<span id="dyamic" :class="['toggle-icon', isDynamic ? 'checked' : '']" @click="toggleDynamic"></span>
									<label class="label-text" for="dyamic" @click="toggleDynamic">Dyanamic</label>
								</div>
							</div>	
							<div class="input-holder">
								<label>Prescript</label>
								<input type="text" v-model="snippetPreScript">
							</div>
						</form>
					</div>
					<div class="main-panel" ref="mainpanel" @mousemove="watchhandle($event)" @mouseup="stophandle()" @mouseleave="stophandle()">
						<template v-if="settings === 'split'">
							<Section ref="left"
							:type="'half'"
							:sec_width="left_sec_width"
							:sec_height="full_height"
							:value="snippetTemplate"
							:lang="'html'"
							@onChangeListener="onChangeHTMLSnippet"
							:insertString="insertString"></Section>
							<div @mousedown="handle($event)" class="gutter" ref="gutter"></div>
							<Section ref="right"
								:type="'split'"
								:sec_width="right_sec_width"
								:sec_height="sec_height"
								:botval="dataResponse"
								:topval="snippetPostScript"
								@onChangeListener="onChangeJavascript"
								:toplang="'javascript'"
								:botlang="'json'">
							</Section>
						</template>
						<template v-if="settings === 'tabs'">
							<div class="tabs_container">
								<div class="editor_tabs">
									<div class="editor_tabs_item" :class="{active: activeTab == i}" @click="toggletab(i)" v-for="(item, i) in snippet_tabs" :key="i"><p>{{item.type}}</p></div>
								</div>
								<div class="editor_tabs_content">
									<div class="section-full" v-if="activeTab == 0">
										<Section ref="left"
										:type="'full'"
										:sec_width="full_width"
										:sec_height="full_height - 47"
										:value="snippetTemplate"
										:lang="'html'"
										@onChangeListener="onChangeHTMLSnippet"
										:insertString="insertString"></Section>
									</div>
									<div class="section-full " v-else-if="activeTab == 1">
										<Section ref="left"
										:type="'full'"
										:sec_width="full_width"
										:sec_height="full_height - 47"
										:value="snippetPostScript"
										:lang="'javascript'"
										@onChangeListener="onChangeJavascript"></Section>
									</div>
									<div class="section-full " v-else-if="activeTab == 2">
										<Section ref="left"
										:type="'full'"
										:sec_width="full_width"
										:sec_height="full_height - 47"
										:value="dataResponse"
										@onChangeListener="onChangeJson"
										:lang="'json'"></Section>
									</div>
								</div>
							</div>
						</template>
					</div>
					<transition name="fade" mode="out-in">
					<div v-if="isActiveDataModal" @click.self="closemodal($event)" class="full-screen-wrapper">
						<div class="modal leftdir" :style="{top: postopmodal + 'px', left: posleftmodal + 'px'}">
							<div class="modal-form-content">
							<template v-if="wichDataType === '0'">
									<label for="">Data Source Url - all widgets defined</label>
									<div class="form-section">
										<select @change="requestData(selectedData)" name="" id="" v-model="selectedData">
											<option value="" disabled selected hidden>Select data</option>
											<option v-for="(item, i) in datasource" :key="i" :value="item">
												{{item.Name}}
											</option>
										</select>
									</div>
									<div v-if="datasourceparams.length > 0">
										<form @submit.prevent="generatedatasource">
										<label for="">Widget required values</label>
										<div class="data-source-params">
											<input v-for="(item, i) in datasourceparams" v-model="querydatasrouceparams[i]" required :key="i" type="number" :placeholder="item.Name">
										</div>
										<div class="action">
											<button type="submit" class="btn btn-green">Generate</button>
											<button class="btn btn-grey" @click="closemodal">Cancel</button>
										</div>
										</form>
									</div>
							</template>
							<template v-else-if="wichDataType === '1'">
								<form @submit.prevent="customApi">
										<label for="">Add external data source url *</label>
										<div class="data-source-params">
											<input type="text" v-model="externalApi" placeholder="Data source url">
										</div>
										<div class="action">
											<button type="submit" class="btn btn-green">Generate</button>
											<button class="btn btn-grey" @click="closemodal">Cancel</button>
										</div>
									</form>
							</template>
							</div>
						</div>
					</div>
				</transition>
				</template>
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
			type: '',
			// page vars
			isFullPage: false,
			pageContent: '',
			pageName: '',
			pageHead: '',
			pageFullPage: '',
			// snippet vars
			externalApi: '',
			querydatasrouceparams: [],
			datatype: '',
			datatypes: [
				{Id: 0, Name: 'Choose from widget builder module'},
				{Id: 1, Name: 'Add an external data source type'}
			],
			isDynamic: false,
			isActiveDataModal: false,
			snippetName: '',
			snippetCategory: '',
			snippetTemplate: '',
			snippetPostScript: '',
			snippetDataType: '',
			snippetPreScript: '',
			snippetStatus: '',
			selectedData: '',
			// new
			left_sec_width: 0,
			right_sec_width: 0,
			// sec_width: 0,
			sec_height: 0,
			full_width: 0,
			full_height: 0,
			// old
			selectedSnippet: '',
			insertString: '',
			mousemove: false,
			activeTab: false,
			page_tabs: [
				{
					type: 'PageEditor',
					editor: 'page'
				}
			],
			snippet_tabs: [
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
		closemodal() {
			this.datatype = '';
			this.isActiveDataModal = false;
		},
		requestData (val) {
			this.$store.dispatch('requestData', val.Id);
		},
		datatypeselect(e) {
			if (e.target.value) {
				this.wichDataType = e.target.value;
				this.isActiveDataModal = true;
			}
		},
		customApi() {
			this.$store.dispatch('callExternalApi', this.externalApi);
		},
		generatedatasource() {
			this.querydatasrouceparams;
			this.$store.dispatch('queryDatSrouceParams', [this.selectedData ,this.querydatasrouceparams])
		},
		toggleDynamic() {
			this.isDynamic = !this.isDynamic;
			if (this.isDynamic) {
				this.snippetStatus = 1;
			} else {
				this.snippetStatus = 0;
			}
		},
		toggleStaus() {
			this.isFullPage = !this.isFullPage;
			if (this.isFullPage) {
				this.pageFullPage = '1';
			} else {
				this.pageFullPage = '0';
			}
		},
		addSubSnippet (val) {
			console.log(this.selectedSnippet)
			return this.selectedSnippet
		},
		SavePage () {
			this.page = {
				Name: this.pageName,
				Content: this.pageContent,
				Head: this.pageHead,
				FullPage: this.pageFullPage
			}
			this.$store.dispatch('createPage', this.page)
		},
		saveSnippet () {
			this.snippet = {
				Name: this.snippetName,
				Category: this.snippetCategory,
				Template: this.snippetTemplate,
				PreScript: this.snippetPreScript,
				PostScript: this.snippetName,
				DataUrl: this.snippetDataType,
				Status: this.snippetStatus,
				PostScriptContent: this.snippetPostScript
			}
			this.$store.dispatch('createSnippet', this.snippet)
		},
		addHeadSnippet () {

		},
		toggletab (i) {
			this.activeTab = i
		},
		insertSnippet () {
			return this.insertString = this.selectedSnippet
		},
		onChangeHTMLPage (val) {
			this.pageContent = val
			this.selectedSnippet = ''
		},
		onChangeHTMLSnippet (val) {
			this.snippetTemplate = val
			this.selectedSnippet = ''
		},
		onChangeJavascript (val) {
			this.snippetPostScript = val;
		},
		onChangeJson (val) {

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
	mounted () {
		const mainWidth = window.innerWidth - 239
		const mainHeight = window.innerHeight - 56
		this.left_sec_width = Math.floor(mainWidth / 2)
		this.right_sec_width = Math.floor(mainWidth / 2)
		this.sec_height = mainHeight
		this.full_width = mainWidth
		this.full_height = mainHeight - 36

		this.postopmodal = this.$refs.datatypesSelect.offsetTop - 14
		this.posleftmodal = (this.$refs.datatypesSelect.offsetLeft + this.$refs.datatypesSelect.offsetWidth) + 15;
	},
	beforeMount () {
		this.type = this.$route.params.type
	},
	computed: {
		settings () {
			return this.$store.getters.getMode
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
		},
		datasource () {
			return this.$store.getters.getDataSource
		},
		dataResponse() {
			return this.$store.getters.getDataResponse
		},
		datasourceparams() {
			return this.$store.getters.getDataSourceParams
		}

	}
}
</script>
<style lang="scss">

</style>
