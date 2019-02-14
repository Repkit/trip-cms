<template>
	<div :id="id ? id: $options._componentTag +'-'+ _uid"
			:class="$options._componentTag">
		<slot></slot>
	</div>
</template>
<script>
import ace from 'brace'
export default {
	 props: ['value', 'id', 'options'],
	 watch: {
		value () {
			//  two way binding – emit changes to parent
			this.$emit('input', this.value)

			//  update value on external model changes
			if (this.oldValue !== this.value) {
				this.editor.setValue(this.value, 1)
			}
		}
	},

	mounted () {
		//  editor
		this.editor = ace.edit(this.$el.id)

		//  deprecation fix
		this.editor.$blockScrolling = Infinity

		//  ignore doctype warnings
		const session = this.editor.getSession()
		session.on('changeAnnotation', () => {
			const a = session.getAnnotations()
			const b = a.slice(0).filter((item) => item.text.indexOf('DOC') == -1)
			if (a.length > b.length) session.setAnnotations(b)
		})

		//  editor options
		//  https://github.com/ajaxorg/ace/wiki/Configuring-Ace
		this.options = this.options || {}

		//  opinionated option defaults
		this.options.maxLines = this.options.maxLines || Infinity
		this.options.printMargin = this.options.printMargin || false
		this.options.highlightActiveLine = this.options.highlightActiveLine || false

		//  hide cursor
		if (this.options.cursor === 'none' || this.options.cursor === false) {
			this.editor.renderer.$cursorLayer.element.style.display = 'none'
			delete this.options.cursor
		}

		//  add missing mode and theme paths
		if (this.options.mode && this.options.mode.indexOf('ace/mode/') === -1) {
			this.options.mode = `ace/mode/${this.options.mode}`
		}
		if (this.options.theme && this.options.theme.indexOf('ace/theme/') === -1) {
			this.options.theme = `ace/theme/${this.options.theme}`
		}
		this.editor.setOptions(this.options)

		//  set model value
		//  if no model value found – use slot content
		if (!this.value || this.value === '') {
			this.$emit('input', this.editor.getValue())
		} else {
			this.editor.setValue(this.value, -1)
		}

		//  editor value changes
		this.editor.on('change', () => {
			//  oldValue set to prevent internal updates
			this.value = this.oldValue = this.editor.getValue()
		})
	},
	methods: { editor () { return this.editor } }
}
</script>
