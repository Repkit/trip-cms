<template>
	<div ref="editor" :id="getId" :style="{width: width + 'px', height: height + 'px'}">

	</div>
</template>
<script>

import ace from 'brace'
require('brace/ext/language_tools')

export default {
	props: {
		name: {
			type: String,
			default: ''
		},
		lang: {
			type: String,
			default: 'javascript'
		},
		theme: {
			type: String,
			default: 'monokai'
		},
		value: {
			type: String,
			default: ''
		},
		fontsize: {
			type: Number,
			default: ''
		},
		'width': {
			type: Number,
			default: '500'
		},
		'height': {
			type: Number,
			default: '500'
		},
		onInsert: {
			type: String,
			default: ''
		},
		onChange: {
			type: Function,
			default: null
		}
	},
	data () {
		return {
			editor: ''
		}
	},
	computed: {
		getId () {
			return this.name
		}
	},
	watch: {
		'value': function (val, oldVal) {
			this.editor.setValue(val, 1)
		},
		'onInsert': function (val, oldVal) {
			this.onInsertListener(val)
		},
		'width': function (val, oldVal) {
			if (val != oldVal) {
				this.editor.resize()
			}
		},
		'height': function (val, oldVal) {
			if (val != oldVal) {
				this.editor.resize()
			}
		}
	},
	methods: {
		onChangeListener () {
			this.onChange(this.editor.getValue())
		},
		onInsertListener (data) {
			this.editor.insert(data)
		}
	},
	mounted () {
		require('brace/mode/' + this.lang)
		require('brace/theme/' + this.theme)
		this.editor = ace.edit(this.name)
		this.editor.getSession().setMode('ace/mode/' + this.lang)
		this.editor.setTheme('ace/theme/' + this.theme)
		this.editor.getSession().setValue(this.value, 1)
		this.editor.session.on('change', this.onChangeListener)
		this.editor.resize()
		/* this.editor.renderer.setShowGutter(true);
		this.editor.session.setUseWrapMode(true);
		this.editor.setShowPrintMargin(false);
		this.editor.navigateFileEnd();
		this.$refs.editor.style.fontSize=this.fontsize + 'px';
		this.editor.resize(); */
		// this.editor.resize();
	}
}
</script>
<style lang="scss">

</style>
