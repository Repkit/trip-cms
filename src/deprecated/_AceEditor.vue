<template>
	<div ref="editor" :id="getId" :style="{width: options.width + 'px', height: options.height + 'px', 'font-size': options.fontsize + 'px'}">
	</div>
</template>
<script>
import ace from 'brace'

export default {
	props: {
		value: {
			type: String,
        	default: ''
		},
		props: String,
		lang: String,
		theme: String,
		options: Object
	},
	data () {
		return {
			getId: null,
			editor: null
		}
	},
	mounted () {
		this.editor = ace.edit(this.$refs.editor)
		require('brace/mode/' + this.lang)
		require('brace/theme/tomorrow_night')
		this.editor.getSession().setMode('ace/mode/' + this.lang)
		this.editor.setTheme('ace/theme/tomorrow_night')
		this.editor.setShowPrintMargin(false)
		this.editor.getSession().setUseWrapMode(true)
		this.editor.getSession().on('changeAnnotation', () => {
			const a = this.editor.getSession().getAnnotations()
			const b = a.slice(0).filter((item) => item.text.indexOf('DOC') == -1)
			if (a.length > b.length) this.editor.getSession().setAnnotations(b)
		})
		this.editor.highlightActiveLine = false
		this.editor.highlightGutterLine = false
		this.$emit('init')
		this.editor.resize()
	},
	computed: {

	},
	watch: {
		'value': function (newVal, oldVal) {
			if (this.editor && this.editor.getValue() !== newVal) {
				this.silent = true
				const pos = this.editor.session.selection.toJSON()
				this.editor.setValue(newVal, pos.cursorStart)
				this.editor.session.selection.fromJSON(pos)
				this.silent = false
			}
		},
		'width' (val, oldVal) {
			console.log('width', val, oldVal)
		},
		deep: true
	}
}
</script>
<style lang="scss">

</style>
