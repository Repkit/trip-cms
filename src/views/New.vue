<template>
	<div class="component-container">
		<div class="content">
			<div class="panel-container">
				<template v-if="type === 'page'">
					<div class="meta-header">
						<form @submit.prevent="createPage">
							<button type="submit" class="submit-styled">
								<font-awesome-icon :icon="['fas', 'rocket']"></font-awesome-icon><p>Publish page</p>
							</button>
							<div class="input-holder">
								<label for="">Name *</label>
								<input type="text" required v-model="page.Name" placeholder="Page name">
							</div>
							<div class="input-holder">
								<label for="">Category </label>
								<input type="text" v-model="page.Category" placeholder="Page category">
							</div>
							<div class="input-holder">
								<!--<label for="">Head snippet</label>
								<div class="input-group">
										<select name="" id="" :v-model="page.Head">
										<option value="" disabled selected hidden>Chose header snippet</option>
										<option value="">No header</option>
										<option value="" v-for="(item, i) in headSnippets" :key="i">
											{{item.Name}}
										</option>
									</select>
								</div>-->
								<label for="">Insert subsnippet</label>
								<div class="input-group">
									<Sort :payload="snippets" :sortBy="'Name'"
									@requestInsertSnippet="insertSnippet"></Sort>
										<!-- <select name="" id="" v-model="selectedSnippet">
											<option value="" disabled selected hidden>Chose snippet</option>
											<option v-for="(item, i) in snippets" :key="i" :value="item.Placeholder">
												{{item.Name}}
											</option>
									</select> -->
								</div>
							</div>
							<div class="input-holder">
								<div class="togglecheckbox" style="justify-content: flex-start">
									<span id="fullPage" class="toggle-icon" :class="page.FullPage == 1 ? 'checked': ''" @click="toggleFullPage"></span>
									<label class="label-text" for="fullPage" @click="toggleFullPage">Full page</label>
								</div>
							</div>
							<div class="input-holder">
								<div class="togglecheckbox" style="justify-content: flex-start">
									<span id="staticPage" class="toggle-icon" :class="page.StaticPage == 1 ? 'checked': ''" @click="toggleStaticPage"></span>
									<label class="label-text" for="staticPage" @click="toggleStaticPage">Static page</label>
								</div>
							</div>
							<div class="input-holder">
								<div class="togglecheckbox" style="justify-content: flex-start">
									<span id="crawlablePage" class="toggle-icon" :class="page.Crawlable == 1 ? 'checked': ''" @click="toggleCrawlablePage"></span>
									<label class="label-text" for="crawlablePage" @click="toggleCrawlablePage">Crawlable page</label>
								</div>
							</div>
							<div class="input-holder">
								<label for="">Details </label>
								<textarea v-model="page.Details" rows="4" cols="28" style="background-color: #1c2128;"></textarea>
							</div>
						</form>
					</div>
					<div class="main-panel" ref="mainpanel">
						<template v-if="settings === 'split'">
							<Section ref="left"
							:type="'half'"
							:sec_width="full_width"
							:sec_height="full_height"
							:value="page.Content"
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
										:value="page.Content"
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
                <template v-else-if="type === 'email'">
					<div class="meta-header">
						<form @submit.prevent="createEmail">
							<button type="submit" class="submit-styled">
								<font-awesome-icon :icon="['fas', 'rocket']"></font-awesome-icon><p>Save email</p>
							</button>
							<div class="input-holder">
								<label for="">Name *</label>
								<input type="text" required v-model="email.Name" placeholder="Name">
							</div>
							<div class="input-holder">
								<label for="">Category </label>
								<input type="text" v-model="email.Category" placeholder="Template category">
							</div>
							<div class="input-holder">
								<label for="">Insert subsnippet</label>
								<div class="input-group">
									<Sort :payload="snippets" :sortBy="'Name'" @requestInsertSnippet="insertSnippet"></Sort>
								</div>
							</div>
							<div class="input-holder">
								<label for="">Details </label>
								<textarea v-model="email.Details" rows="4" cols="28" style="background-color: #1c2128;"></textarea>
							</div>
						</form>
					</div>
					<div class="main-panel" ref="mainpanel">
						<template v-if="settings === 'split'">
							<Section ref="left"
							:type="'half'"
							:sec_width="full_width"
							:sec_height="full_height"
							:value="email.Content"
							:lang="'html'"
							@onChangeListener="onChangeHTMLEmail"
							:insertString="insertString"></Section>
						</template>
						<template v-if="settings === 'tabs'">
							<div class="tabs_container">
								<div class="editor_tabs">
									<div class="editor_tabs_item" :class="{active: activeTab == i}" @click="toggletab(i)" v-for="(item, i) in page_tabs" :key="i">
                                        <p>{{item.type}}</p>
                                    </div>
								</div>
								<div class="editor_tabs_content">
									<div class="section-full" v-if="activeTab == 0">
										<Section ref="left"
										:type="'full'"
										:sec_width="full_width"
										:sec_height="full_height - 47"
										:value="email.Content"
										:lang="'html'"
										@onChangeListener="onChangeHTMLEmail"
										:insertString="insertString"></Section>
									</div>
									<div class="section-full " v-else-if="activeTab == 1">
										<Section ref="left" :type="'render'" :sec_width="full_width" :sec_height="full_height" :value="email._links['page-url'].href"></Section>
									</div>
								</div>
							</div>
						</template>
					</div>
				</template>
				<template v-else>
					<div class="meta-header">
						<form @submit.prevent="createSnippet">
							<button type="submit" class="submit-styled">
								<font-awesome-icon :icon="['fas', 'rocket']"></font-awesome-icon><p>Compile snippet</p>
							</button>
							<div class="input-holder">
								<label for="">Name *</label>
								<input type="text" required v-model="snippet.Name" placeholder="Snippet name">
							</div>
							<div class="input-holder">
								<label for="">Category *</label>
								<input type="text" required v-model="snippet.Category" placeholder="Snippet category">
							</div>
							<div class="input-holder">
								<label for="">Insert subsnippet</label>
								<Sort :payload="snippets" :sortBy="'Name'"
									@requestInsertSnippet="insertSnippet">
								</Sort>
							</div>
							<div class="input-holder">
								<label for="">Data source</label>
								<div class="input-group">
										<select name="" @change="datatypeselect($event)" id="" v-model="datatype" ref="datatypesSelect">
											<option value="" disabled selected hidden>Please choose data source</option>
											<option  v-for="(item, i) in datatypes" :key="i" :value="item.Id">
												{{item.Name}}
											</option>
									</select>
								</div>
							</div>
							<div class="input-holder">
								<div class="togglecheckbox" style="justify-content: flex-start">
									<span id="staticSnippet" class="toggle-icon" :class="snippet.Static == 1 ? 'checked': ''" @click="toggleStaticSnippet"></span>
									<label class="label-text" for="staticSnippet" @click="toggleStaticSnippet">Static snippet</label>
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
								:type="'split'"
								:sec_width="left_sec_width"
								:sec_height="sec_height"
								@onTopChangeListener="onChangeHTMLSnippet"
								@onBotChangeListener="onChangeCSSSnippet"
								:topval="snippet.Template"
								:botval="snippet.Css"
								:toptitle="'(template)'"
								:bottitle="'(styles)'"
								:toplang="'twig'"
								:botlang="'css'"
								:insertString="insertString">
							</Section>
							<div @mousedown="handle($event)" class="gutter" ref="gutter"></div>
							<Section ref="right"
								:type="'split'"
								:sec_width="right_sec_width"
								:sec_height="sec_height"
								:botval="dataResponse"
								:topval="snippet.PostScript"
								@onTopChangeListener="onChangeJavascript"
								:toptitle="snippet.Static == 1 ? '(document.ready)': '(render.post)'"
								:bottitle="'(data source response [__ds])'"
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
										:value="snippet.Template"
										:lang="'twig'"
										@onChangeListener="onChangeHTMLSnippet"
										:insertString="insertString"></Section>
									</div>
									<div class="section-full " v-else-if="activeTab == 1">
										<Section ref="left"
										:type="'full'"
										:sec_width="full_width"
										:sec_height="full_height - 47"
										:value="snippet.PostScript"
										:lang="'javascript'"
										@onChangeListener="onChangeJavascript"></Section>
									</div>
									<div class="section-full " v-else-if="activeTab == 2">
										<Section ref="left"
										:type="'full'"
										:sec_width="full_width"
										:sec_height="full_height - 47"
										:value="snippet.Css"
										@onChangeListener="onChangeCSSSnippet"
										:lang="'css'">
										</Section>
									</div>
									<div class="section-full " v-else-if="activeTab == 3">
										<Section ref="left"
										:type="'full'"
										:sec_width="full_width"
										:sec_height="full_height - 47"
										:value="dataResponse"
										@onChangeListener="onChangeJson"
										:lang="'json'">
										</Section>
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
										<label for="">Data source url - all endpoints defined</label>
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
											<label for="">Endpoint required values</label>
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
import Sort from '../components/Sort'
import Section from '../components/Section'
import Editor from '../components/Editor'
export default {
	components: {
		Sort,
		Editor,
		Section
	},
	data () {
		return {
			type: '',
			// snippet vars
			externalApi: '',
			querydatasrouceparams: [],
			datatype: '',
			datatypes: [
				{Id: 0, Name: 'Choose from endpoint builder module'},
				{Id: 1, Name: 'Add an external data source type'}
			],
			isActiveDataModal: false,
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
					type: 'Css',
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
			this.snippet.DataUrl = this.externalApi;
		},
		generatedatasource() {
			this.querydatasrouceparams;
			this.$store.dispatch('queryDatSrouceParams', [this.selectedData ,this.querydatasrouceparams])
		},
		toggleFullPage() {
			if (this.page.FullPage == '1') {
				this.page.FullPage = '0';
			} else {
				this.page.FullPage = '1';
			}
		},
		toggleStaticPage() {
			if (this.page.StaticPage == '1') {
				this.page.StaticPage = '0';
			} else {
				this.page.StaticPage = '1';
			}
		},
		toggleCrawlablePage() {
			if (this.page.Crawlable == '1') {
				this.page.Crawlable = '0';
			} else {
				this.page.Crawlable = '1';
			}
		},
		toggleStaticSnippet() {
			if (this.snippet.Static == '1') {
				this.snippet.Static = '0';
			} else {
				this.snippet.Static = '1';
			}
		},
		addSubSnippet (val) {
			// console.log(this.selectedSnippet)
			return this.selectedSnippet
		},
		createPage () {
			// this.page = {
			var pageData = {
				Name: this.page.Name,
				Category: this.page.Category,
				Content: this.page.Content,
				Head: this.page.Head,
				FullPage: this.page.FullPage,
				StaticPage: this.page.StaticPage,
				Crawlable: this.page.Crawlable,
				Details: this.page.Details,
				Status: '1'
			}
			// this.$store.dispatch('createPage', this.page)
			this.$store.dispatch('createPage', pageData)
		},
		createSnippet () {
			// this.snippet = {
			var snippetData = {
				Name: this.snippet.Name,
				Category: this.snippet.Category,
				Template: this.snippet.Template,
				Static: this.snippet.Static,
				PreScript: this.snippet.PreScript,
				// PostScript: this.snippet.Name + '_postScript.js',
				Css: this.snippet.Css,
				DataUrl: this.snippet.DataUrl,
				Status: this.snippet.Status,
				Params: this.snippet.Params,
				PostScriptContent: this.snippet.PostScript
			}
			// this.$store.dispatch('createSnippet', this.snippet)
			this.$store.dispatch('createSnippet', snippetData)
			this.$store.dispatch('createPostScript', snippetData)
		},
        createEmail () {
			var emailData = {
				Name: this.email.Name,
				Category: this.email.Category,
				Content: this.email.Content,
				Head: "",
				FullPage: "1",
				StaticPage: "0",
				Crawlable: "1",
				Details: this.page.Details,
				Status: '1'
			}
			this.$store.dispatch('createEmail', emailData)
		},
		addHeadSnippet () {

		},
		toggletab (i) {
			this.activeTab = i
		},
		insertSnippet (val) {
			return this.insertString = val.Placeholder
		},
		onChangeHTMLPage (val) {
			this.page.Content = val
			this.selectedSnippet = ''
		},
		onChangeHTMLSnippet (val) {
			this.snippet.Template = val
			this.selectedSnippet = ''
		},
        onChangeHTMLEmail (val) {
			this.email.Content = val
			this.selectedSnippet = ''
		},
		onChangeCSSSnippet (val) {
			this.snippet.Css = val
		},
		onChangeJavascript (val) {
			this.snippet.PostScript = val
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
        //something is not ok here O_o
		if(typeof this.$refs != 'undefined' && typeof this.$refs.datatypesSelect != 'undefined'){
			this.postopmodal = this.$refs.datatypesSelect.offsetTop - 14
			this.posleftmodal = (this.$refs.datatypesSelect.offsetLeft + this.$refs.datatypesSelect.offsetWidth) + 15;
		}else{
			this.postopmodal = 387
			this.posleftmodal = 246
		}

	},
	beforeMount () {
		this.type = this.$route.params.type
		this.$store.dispatch('clearPageState');
		this.$store.dispatch('clearSnippetState');
		this.$store.dispatch('clearEmailState');
	},
	computed: {
		snippet() {
			return this.$store.getters.getSnippet
		},
		page() {
			return this.$store.getters.getPage
		},
		email() {
			return this.$store.getters.getEmail
		},
		settings () {
			return this.$store.getters.getMode
		},
		snippets () {
			return this.$store.getters.getSnippets
		},
		/*headSnippets () {
			return this.snippets.filter((elem) => {
				return elem.Category === 'Head'
			})
		},*/
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
