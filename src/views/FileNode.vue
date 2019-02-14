<template>
	<li v-if="isFolder">
		<div
			:class="{
				'file-browser__folder': isFolder,
				'selected': selected,
			}"
			@click="toggle">
			<font-awesome-icon :icon="open ? 'chevron-down': 'chevron-right'" />
			<font-awesome-icon :icon="open ? 'folder-open': 'folder'" />
			{{ model.name }}
		</div>
		<ul v-show="open" v-if="model.children">
			<FileNode
				class="item"
				v-for="(model, index) in sortedChildren"
				:key="index"
				:model="model"
				:selectedPath="currentPath"
				v-on:changePath="forwardPath"></FileNode>
		</ul>
	</li>
</template>

<script>
export default {
	props: {
		model: Object,
		selectedPath: String
	},
	data: function () {
		return {
			open: this.model.name === '/'
		}
	},
	computed: {
		isFolder: function () {
			return this.model.type === 'dir'
		},
		currentPath: function () {
			if (this.selectedPath === '') return ''
			if (this.selectedPath === '/') return '/'

			let path = this.selectedPath.split('/')
			if (path[0] === '') path[0] = '/'
			if (path[0] === this.model.name) {
				if (path.length > 1) path.shift()
				else return path[0]
			} else return ''
			return path.join('/')
		},
		selected: function () {
			return this.currentPath === this.model.name
		},
		sortedChildren: function () {
			return this.model.children.slice(0).sort(function (a, b) {
				let nameA = a.name.toUpperCase() // ignore upper and lowercase
				let nameB = b.name.toUpperCase() // ignore upper and lowercase
				if (nameA < nameB) {
					return -1
				}
				if (nameA > nameB) {
					return 1
				}
				return 0
			})
		}
	},
	methods: {
		toggle: function () {
			if (this.isFolder) {
				this.open = !this.open
				this.$emit('changePath', this.model.name)
			}
		},
		forwardPath: function (payload) {
			let path = ''
			if (this.model.name === '/') {
				path = '/' + payload
			} else {
				path = this.model.name + '/' + payload
			}
			this.$emit('changePath', path)
		}
	}
}
</script>
