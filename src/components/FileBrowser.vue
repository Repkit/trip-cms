<template>
	<div class="file-browser" @click.stop="actionDropdownOpen = false">

		<nav class="file-browser__nav">
			<div class="nav-form">
				<div class="btn-group" :class="{open: actionDropdownOpen}">
					<button class="nav-action"
						@click.stop="actionDropdownOpen = !actionDropdownOpen">
						<font-awesome-icon icon="ellipsis-v" />
					</button>
					<ul class="dropdown-menu dropdown-menu-right" @click.stop="">
						<li>
							<label>
								<font-awesome-icon icon="cloud-upload-alt" /> Upload files
								<input type="file" name="" class="hidden-input"
									ref="uploader"
									@change="hndUpload">
							</label>
						</li>
					</ul>
				</div>
			</div>
			<h5>File manager</h5>
		</nav>

		<aside class="file-browser__tree">
			<ul class="folder-tree">
				<FileNode
					class="item"
					:model="folderTree"
					:selectedPath="currentPath"
					v-on:changePath="listPath">
				</FileNode>
			</ul>
		</aside>

		<section class="file-browser__content">
			<div class="file-browser__item"
				:class="{selected: item.selected}"
				v-for="(item, i) in branchLeaves" :key="i"
				@click="hndClick(item)"
				@dblclick="hndDblClick(item)">
				<div class="file-browser__item-icon"
					:data-ext="item.type === 'file' ? item.name.split('.').pop() : ''">
					<font-awesome-icon
						:icon="item.type === 'dir' ? 'folder-open' : 'file'" />
				</div>
				<span class="file-browser__item-name">{{item.name}}</span>
			</div>
			<div class="file-browser__nocontent"
				v-if="branchLeaves.length === 0">
				No files in this folder...
			</div>
		</section>
	</div>
</template>

<script>

import Vue from 'vue'
import axios from 'axios'
import FileNode from './FileNode'
Vue.component('FileNode', FileNode)

export default {
	data () {
		return {
			url: 'http://192.168.0.15/~cosmin_berescu/dynapack/clients/bitusi/public/admin/bridges/php-local/index.php',
			isActive: false,
			currentPath: '/',

			folderTree: {
				name: '/',
				type: 'dir',
				children: []
			},

			actionDropdownOpen: false
		}
	},
	methods: {
		hndClick (item) {
			if (item.selected) Vue.set(item, 'selected', false)
			else {
				Vue.set(item, 'selected', true)
			}
		},
		hndDblClick (item) {
			let path = this.currentPath
			if (path[path.length - 1] !== '/') path += '/'
			path += item.name

			if (item.type === 'dir') {
				this.listPath(path)
			} else {
				this.$store.commit('SET_FILE', path)
			}
		},
		hndUpload (ev) {
			const file = this.$refs.uploader.files[0]
			if (!file) return
			const formdata = new FormData()
			formdata.append('destination', this.currentPath)
			formdata.append('file-0', file)
			axios({
				method: 'post',
				url: this.url,
				withCredentials: true,
				data: formdata
			}).then((response) => {
				this.listPath(this.currentPath)
			}).catch((error) => {
				// TODO: handle errors
				console.error(error)
			}).finally(() => {
				this.actionDropdownOpen = false
			})
		},
		listPath (path) {
			axios({
				method: 'post',
				url: this.url,
				withCredentials: true,
				data: `action=list&path=${path}`
			}).then((response) => {
				this.setTreeBranch(path, response.data.result)
			}).catch((error) => {
				// this.setTreeBranch('/wrong', [{name: "wronger", rights: "drwxr-xr-x", size: 4096, date: "2018-11-19 07:46:00", type: "dir"}]);
				// this.currentPath = path;
				console.error(error)
			})
		},
		getTreeBranch (path) {
			let treeBranch = this.folderTree
			if (path !== '/') {
				let pathSegments = this.pathToArray(path)
				for (let p = 1; p < pathSegments.length; p++) {
					treeBranch = treeBranch.children.find((branch) => {
						return branch.name === pathSegments[p]
					})
				}
			}
			return treeBranch
		},
		setTreeBranch (path, leaves) {
			let treeBranch = this.getTreeBranch(path)
			Vue.set(treeBranch, 'children', leaves)
			this.currentPath = path
		},
		pathToArray (path) {
			if (path === '/') return ['/']
			let array = path.split('/')
			array[0] = '/'
			return array
		}
	},
	computed: {
		branchLeaves () {
			let branch = this.getTreeBranch(this.currentPath)
			return branch.children || []
		},
		// TODO: nuke this?
		sortedTreeKeys () {
			return Object.keys(this.folderTree).sort()
		}
	},
	beforeMount () {
		axios({
			method: 'post',
			url: this.url,
			withCredentials: true,
			data: 'action=list&path=/'
		}).then((response) => {
			this.setTreeBranch('/', response.data.result)
		}).catch((error) => {
			/* eslint-disable */
			// this.setTreeBranch('/', [
			// {name: "wrong", rights: "drwxr-xr-x", size: 4096, date: "2018-11-19 07:45:52", type: "dir"},
			// {name: "b", rights: "drwxr-xr-x", size: 4096, date: "2018-11-19 07:46:00", type: "dir"},
			// {name: "logo.png", rights: "-rw-r--r--", size: 3451, date: "2018-11-19 12:40:48", type: "file"},
			// {name: "test1", rights: "drwxr-xr-x", size: 4096, date: "2018-11-19 07:42:14", type: "dir"},
			// {name: "test2", rights: "drwxr-xr-x", size: 4096, date: "2018-11-19 07:42:14", type: "dir"},
			// {name: "test3", rights: "drwxr-xr-x", size: 4096, date: "2018-11-19 07:42:14", type: "dir"},
			// ]);

			/* eslint-enable */
			console.error(error)
		})
	}
}
</script>

<style lang="scss">
$darkblue: #000e3a;

.open > .dropdown-menu { display: block; }

.folder-tree, .folder-tree ul {
	list-style: none;
	margin: 0;
	padding: 0 0 0 16px;
}
.folder-tree {
	padding: 7px 0 7px 16px;
}

.file-browser {
	background-color: #f2f3f6;
	height: 100%;
	box-shadow: 0 0 15px 5px rgba(0, 0, 0, 0.1);
}
.file-browser .dropdown-menu label {
	cursor: pointer;
}
.file-browser__tree {
	background-color: #fff;
	width: 25%;
	float: left;
}
.file-browser__nav {
	background-color: $darkblue;
	color: #fff;
	& > h5 {
		height: 48px;
		line-height: 45px;
		margin: 0 0 0 12px;
	}
	& > .nav-form {
		float:right;
		padding: 9px 12px 0 0;
	}
	& .nav-action {
		padding: 2px;
		width: 32px;
		height: 30px;
		margin-left: 5px;
		border: none;
		border-radius: 6px;
		background-color: transparent;
		color: #fff;
		outline: none;
		&:hover {
			background-color: #759dcb;
		}
	}
	& li {
		padding: 6px 20px;
		cursor: pointer;
	}
}
.file-browser__item {
	width: 100px;
	max-height: 100px;
	float: left;
	margin-bottom: 9px;
	margin-right: 9px;
	background-color: transparent;
	color: #000;
	text-align: center;
	cursor: pointer;
	user-select: none;
	&.selected {
		background-color: $darkblue;
		color: #fff;
	}
	&:hover {
		color: #1378b9;
	}
}
.file-browser__item-icon{
	font-size: 32px;
	height: 45px;
	padding-top: 10px;
	color: $darkblue;
	position: relative;

	.selected > & {
		color: #fff;
	}
	.selected > &:after {
		color: $darkblue;
	}
	&:after {
		content: attr(data-ext);
		position: absolute;
		left: 42px;
		top: 27px;
		color: #fff;
		font-size: 9px;
		text-transform: uppercase;
		text-align: center;
	}
}
.file-browser__item-name {
	pointer-events: none;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	display: block;
}
.file-browser__folder {
	display: flex;
	align-items: center;
	color: #7a7a7a;
	&:hover {
		color: #1378b9;
	}
	&.selected {
		color: $darkblue;
	}

	& > * {
		margin-right: 2px;
	}
	& > *:first-child {
		margin-right: 8px;
		font-size: 10px;
	}
}
.file-browser__content {
	width: 75%;
	margin-left: 25%;
	height: calc(100% - 48px);
	overflow: auto;
}
.file-browser__nocontent {
	background-image: -webkit-linear-gradient(top, #fcf8e3 0%, #f8efc0 100%);
	background-image: -webkit-gradient(linear, left top, left bottom, from(#fcf8e3), to(#f8efc0));
	background-image: linear-gradient(to bottom, #fcf8e3 0%, #f8efc0 100%);
	filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#fffcf8e3', endColorstr='#fff8efc0', GradientType=0);
	background-repeat: repeat-x;
	border-color: #f5e79e;
	text-shadow: 0 1px 0 rgba(255, 255, 255, .2);
	-webkit-box-shadow: inset 0 1px 0 rgba(255, 255, 255, .25), 0 1px 2px rgba(0, 0, 0, .05);
	box-shadow: inset 0 1px 0 rgba(255, 255, 255, .25), 0 1px 2px rgba(0, 0, 0, .05);
	color: #8a6d3b;
	background-color: #fcf8e3;
	padding: 15px;
	margin-bottom: 20px;
	border: 1px solid transparent;
	border-radius: 4px;
	margin: 12px;
}
</style>
