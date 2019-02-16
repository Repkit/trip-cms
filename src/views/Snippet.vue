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
					<form @submit.prevent="compileSnippet">
						<button type="submit" class="submit-styled">
							<font-awesome-icon :icon="['fas', 'rocket']"></font-awesome-icon><p>Compile Code</p>
						</button>
						<div class="input-holder">
							<label for="">Snippet name *</label>
							<input type="text" required v-model="snippet.Name" placeholder="Snippet name">
						</div>
						<div class="input-holder">
							<label for="">Category *</label>
							<input type="text" required v-model="snippet.Category" placeholder="Snippet category">
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
							<label>Static snippet</label>
							<div class="togglecheckbox" style="justify-content: flex-start">
								<span id="staticSnippet" class="toggle-icon" :class="{'checked': isStatic}" @click="toggleStatic"></span>
								<label class="label-text" for="staticSnippet" @click="toggleStatic">Static snippet</label>
							</div>
						</div>	
						<div class="input-holder">
							<label>Prescript</label>
							<input type="text" v-model="snippet.PreScript">
						</div>
					</form>
				</div>
				<div class="main-panel" ref="mainpanel" @mousemove="watchhandle($event)" @mouseup="stophandle()" @mouseleave="stophandle()">
					<template v-if="settings === 'split'">
                        <Section ref="left"
							:type="'half'"
							:sec_width="left_sec_width"
							:sec_height="sec_height"
							:value="snippet.Template"
							:lang="'html'"
							@onChangeListener="onChangeHTMLSnippet"
							:insertString="insertString"></Section>
                        <div @mousedown="handle($event)" class="gutter" ref="gutter"></div>
						<Section ref="left"
							:type="'split'"
							:sec_width="right_sec_width"
							:sec_height="sec_height"
							:botval="dataResponse"
							@onChangeListener="onChangeJavascript"
							:topval="postScriptContent"
							:botlang="'json'"
							:toplang="'javascript'"></Section>
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
									@onChangeListener="onChangeHTMLSnippet"
									:insertString="insertString"></Section>
								</div>
								<div class="section-full " v-else-if="activeTab == 1">
									<Section ref="left"
									:type="'full'"
									:sec_width="full_width"
									:sec_height="full_height - 47"
									:value="postScriptContent"
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
			</div>
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
	</div>
</template>
<script>
import Section from '../components/Section'
import FileBrowser from './FileBrowser'
export default {
	components: {
		Section,
		FileBrowser
	},
	data () {
		return {
			//modal
			postopmodal: 0,
			posleftmodal: 0,
			bgImage: '',
			// new
			split_height: 0,
			left_sec_width: 0,
			right_sec_width: 0,
			// sec_width: 0,
			sec_height: 0,
			full_width: 0,
			full_height: 0,
			// Data type slection
			externalApi: '',
			querydatasrouceparams: [],
			datatype: '',
			datatypes: [
				{Id: 0, Name: 'Choose from widget builder module'},
				{Id: 1, Name: 'Add an external data source type'}
			],
			// old
			isStatic: false,
			isActiveDataModal: false,
			wichDataType: 0,
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
		customApi() {
			debugger
			this.$store.dispatch('callExternalApi', this.externalApi);
		},
		generatedatasource() {
			this.querydatasrouceparams;
			this.$store.dispatch('queryDataSourceParams', [this.selectedData ,this.querydatasrouceparams]);
		},
		toggleStatic() {
			this.isStatic = !this.isStatic;
			if (this.isStatic) {
				this.snippet.Static = '1';
			} else {
				this.snippet.Static = '0';
			}
		},
		datatypeselect(e) {
			if (e.target.value) {
				this.wichDataType = e.target.value;
				this.isActiveDataModal = true;
			}
		},
		closemodal() {
			this.datatype = '';
			this.isActiveDataModal = false;
		},
		requestData (val) {
			this.$store.dispatch('requestData', val.Id);
		},
		insertSnippet () {
			return this.insertString = this.selectedSnippet
		},
		onChange (val) {
			this.snippet.Template = val
		},
		onChangeHTMLSnippet (val) {
			// this.snippet.Template = val
			this.$store.dispatch('updateSnippetTemplate', val);
		},
		onChangeJavascript(val) {
			// this.postScriptContent = val
			this.$store.dispatch('updatePostScript', val);
		},
		onChangeJson (val) {

		},
		hndFileSelect (path) {
			this.depend = this.$PROJECT_BASE_URL + '/published/' + path
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
			let payload = {
				Name: this.snippet.Name,
				PostScriptContent: this.postScriptContent
			}
			this.$store.dispatch('editPostScript', payload)
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
			this.left_sec_width;
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
		const mainWidth = window.innerWidth - 240
		const mainHeight = window.innerHeight - 56
		this.left_sec_width = Math.ceil(mainWidth / 2)
		this.right_sec_width = Math.ceil(mainWidth / 2)
		this.sec_height = mainHeight
		this.full_width = mainWidth - 1
		this.full_height = mainHeight - 47
		this.split_height = mainHeight / 2
		this.isStatic = this.snippet.Static

		this.postopmodal = this.$refs.datatypesSelect.offsetTop - 14
		this.posleftmodal = (this.$refs.datatypesSelect.offsetLeft + this.$refs.datatypesSelect.offsetWidth) + 15;

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
		},
		dataResponse() {
			return this.$store.getters.getDataResponse
		},
		datasourceparams() {
			return this.$store.getters.getDataSourceParams
		},
		postScriptContent() {
			return this.$store.getters.getPostScriptContent
		}
	},
	beforeMount () {
		let snippetid = this.$route.params.id
		if (snippetid.length > 0) {
			this.$store.dispatch('loadSnippet', this.$route.params.id)
		}
	},
	destroyed () {
		this.$store.commit('clearSnippetState');
	}
}
</script>
<style lang="scss">
</style>
