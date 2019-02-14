<template>
	<div class="panel" ref="panel">
		<ace-editor v-model="content" :lang="'html'" theme="'tomorrow_night'" :options="options" @init="configEditor"></ace-editor>
	</div>
</template>
<script>
import AceEditor from './AceEditor'

export default {
	props: ['content'],
	components: {
		AceEditor
	},
	data () {
		return {
			options: {
				width: 500,
				height: 500
			}
		}
	},
	methods: {
		configEditor () {
			this.options.width = this.$refs.panel.clientWidth
			this.options.height = this.$refs.panel.clientHeight
		},
		resize () {
			console.log(this.$refs.panel.clientWidth)
		}
	},
	computed: {

	},
	watch: {
		content: function (val) {
			console.log(val)
		}
	},
	mounted () {
		this.resize()
	}

}
</script>
<style lang="scss">
.panel {
	display: flex;
	flex: 1 1 auto;
	flex-grow: 0;
	min-width: 140;
	max-width: calc(100% - 140px);
}
</style>
