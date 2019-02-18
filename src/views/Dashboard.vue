<template>
	<div id="main">
		<transition-group name="fade" mode="out-in">
			<div v-for="(toast, t) in toasts" :key="`toast_${t}`"
				:class="toast.type"
				@click="holdThis(toast)" class="toast">
				<p>{{toast.msg}}</p>
				<font-awesome-icon aria-hidden="true"
				@click="removeThis(toast)"
				:icon="['fas', 'times']" />
			</div>
			<!-- <div v-for="(toast, t) in toasts" :key="`toast_${t}`"
				class="growl-item"
				:class="toast.type"
				@click="holdThis(toast)">
				<button type="button" class="close" aria-hidden="true"
					@click="removeThis(toast)">×</button>
				<div class="time-loader">
					<div class="progress-bar progress-bar-striped active"
						:style="{ width: toast.ttl + '%' }"
					></div>
				</div>
				<div class="top-msg"></div>
				<div class="bottom-msg">{{toast.msg}}</div>
			</div> -->
		</transition-group>
		<div class="sidenav">
			<div class="sidenav-left">
				<router-link tag="div" class="sidenav-item dashboard-icon" :to="{ path: '/pages', name: 'pages'}">
					<font-awesome-icon :icon="['fab', 'vuejs']" />
				</router-link>
				<router-link tag="div" class="sidenav-item" :to="{ path: '/pages', name: 'pages'}">
					<font-awesome-icon :icon="['far', 'file-alt']"></font-awesome-icon>
					<p>Pages</p>
				</router-link>
				<router-link tag="div" class="sidenav-item" :to="{ path: '/snippets', name: 'snippets'}">
					<font-awesome-icon :icon="['far', 'file-code']"></font-awesome-icon>
					<p>Snippets</p>
				</router-link>
			</div>
			<div class="sidenav-right">
				<div class="sidenav-item" @click="togglesettings()" ref="settings">
					<font-awesome-icon :icon="['fas', 'sliders-h']"></font-awesome-icon>
					<p>Settings</p>
				</div>
				<transition name="fade" mode="out-in">
					<div v-if="active" @click.self="closemodal($event)" class="full-screen-wrapper">
						<drop-down-modal :width="329" :reference="$refs">
						</drop-down-modal>
					</div>
				</transition>
				<template v-if="isLogedIn">
					<router-link tag="div" class="sidenav-item" @click.native="logout" :to="{ path: '/login', name: 'login'}">
						<font-awesome-icon :icon="['fas', 'sign-out-alt']"></font-awesome-icon>
						<p>Logout</p>
					</router-link>
				</template>
				<template v-else>
					<router-link tag="div" class="sidenav-item" :to="{ path: '/login', name: 'login'}">
						<font-awesome-icon :icon="['far', 'user-circle']"></font-awesome-icon>
						<p>Sign In</p>
					</router-link>
				</template>
				
			</div>
		</div>
		<div class="main-container">
			<router-view></router-view>
		</div>
	</div>
</template>
<script>
import DropDownModal from '../components/DropDownModal'
export default {
	components: {
		DropDownModal
	},
	data () {
		return {
			active: false,
			refObj: {}
		}
	},
	methods: {
		logout() {
			this.$store.dispatch('logout');
		},
		addToast() {
			this.$store.commit('Toast/_add', Math.random());
		},
		holdThis(toast) {
			if (toast.intervalID) {
				window.clearInterval(toast.intervalID);
				toast.intervalID = null;
			} else {
				this.removeThis(toast);
			}
		},
		removeThis(toast) {
			this.$store.commit('Toast/_remove', toast);
		},
		togglesettings () {
			this.active = !this.active
		},
		closemodal (e) {
			e.stopPropagation()
			this.active = false
		}
	},
	mounted() {

	},
	computed: {
		toasts() {
			return this.$store.getters['Toast/_toasts'];
		},
		isLogedIn() {
			return this.$store.getters.isLoggedIn;
		}
	},
	created () {
		this.$store.dispatch('fetchPages')
		this.$store.dispatch('fetchSnippets')
		this.$store.dispatch('fetchWidgets')
		this.$store.dispatch('fetchDataSource')
	}
}
</script>
<style lang="scss">
#main {
	position: relative;
	display: flex;
	flex: 1 0 0;
	flex-direction: column;
}
.sidenav {
	z-index: 3;
	display: flex;
	flex: 0 0 1;
	height: 56px;
	background: #1C2128;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
}
.main-container {
	z-index: 2;
	background: #20262E;
	flex: 2 0 0;
}
.sidenav-left, .sidenav-right {
	display: flex;
	flex-direction: row;
}
.sidenav-item {
	position: relative;
	display: flex;
	flex-flow: row wrap;
	align-items: center;
	justify-content: space-around;
	padding: 0 10px;
	border-bottom: #1C2128 solid 1px;

	&.leftnav{
		justify-content: flex-start;
		border-bottom: #2D333B solid 1px;

		&:hover {
			& svg {
				color: #66E994;
			}
		}
	}

	&.dashboard-icon {
		padding: 0 20px;
		& svg {
			color: #66E994;
			font-size: 22px;
		}
	}

	&:hover {
		cursor: pointer;
	}

	& svg {
		color: #F2EFE8;
		font-size: 18px;
	}

	& p, span {
		padding: 0 0 0 10px;
		font-size: 14px;
	}
}
.btn {
	border-radius: 3px;
	border:none;
	padding: 0 7px;
	height: 21px;
	cursor: pointer;
	font-size: 12px;

	&.btn-green {
		background: #64B448;
		color:#F2EFE8;
	}
	&.btn-grey {
		background: #373C43;
		color:#F2EFE8;
	}
	&.btn-darkgrey {
		color: #373C43;
	}

	&.btn-icon {
		background: none;
		color: #F2EFE8;
		font-size: 14px;

		&:hover {
			color:#64B448;
		}

		&.btn-icon-grey {
			color:#39464E;

			&:hover {
				color:#39464E;
			}
		}

		&.btn-icon-darkgrey {
			color: #373C43;
		}
	}
}
table {
	th {
		text-align: left;
		border-right: #2D333B solid 1px;
		padding: 0 0 0 14px;
		align-items: center;

		&:last-child {
			border:none;
		}
	}
	th[align="center"] {
		text-align: center;

		& p {
			text-align: center
		}
	}
	td {
		padding: 0 0 0 14px;
		border: #2D333B solid 1px;
		border-top: none;
		border-left: none;

		&:last-child {
			border-right:none;
		}
	}
}
.heading {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
	flex: 1 0 0;
	border-bottom: #2D333B solid 1px;

	& p {
		padding: 0 14px;
	}
}
.content {
	flex: 2 0 0;
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	height: 100%;
}
.component-container {
	height: 100%;
}
.list {
}
.list-item-id {
	text-align: center;
	width: 50px;
}
.list-heading {
	border-bottom: #2D333B solid 1px;
}
.list-item {
	background: #262C34;
	border-bottom: #2D333B solid 1px;

	&:hover {
		background: #4E505A;
	}
}
.list-item-action {
	text-align: center;
	width: 112px;
}
.pagination {
	display: flex;
	flex: 1;
	justify-content: flex-end;
	align-items: center;

	& > * {
		margin-right:14px;
	}
}
.panel-container {
	flex: 1;
	display: flex;
	flex-direction: row;
	height: 100%;
}
.main-panel {
	overflow: hidden;
	display: flex;
	flex: 1;
}
.meta-header {
	width: 224px;
	padding: 0 7px;
	border-right:#2D333B solid 1px;
}
.meta-title {
	    height: 21px;
		line-height: 21px;
		font-weight: 400;
		font-size: 14px;
}
.input-holder {
	margin-bottom: 14px;

	& label {
		color: #8e9195;
		font-size: 13px;
		height: 35px;
		line-height: 35px;
		display: block;

		&.file-upload {
			border:#2D333B solid 1px;
			padding: 0 0 0 14px;
			font-size: 13px;
			color: #FBFBFB;
			cursor: pointer;

			& svg {
				margin: 0 7px 0 0;
			}

			&:hover {
				color:#64B448;
			}
		}
	}

	& select {
		width: 100%;
		padding: 7px;
		border: none;
		border-radius: 3px;
		color: #FBFBFB;
		background: #1C2128;
		border:#2D333B solid 1px;
	}

	& input[type=text] {
		width: calc(100% - 14px);
		height: 35px;
		color: #FBFBFB;
		font-size: 13px;
		background: #1C2128;
		border: none;
		padding: 0 7px;
		margin-bottom: 7px;
		border-radius: 3px;
	}
}
.fade-enter-active,
.fade-leave-active {
	transition: all .2s ease;
}
.fade-enter, .fade-leave-to {
	opacity: 0;
}

.slide-fade-enter-active {
	transition: all .2s ease;
}
.slide-fade-leave-active {
	transition: all .1s ease;
}
.slide-fade-enter, .slide-fade-leave-to
{
	transform: translateX(50px);
	opacity: 0;
}
@keyframes flip-out {
	from {
		transform: rotateX(0deg);
	}
	to {
		transform: rotateX(20deg);
	}
}
@keyframes flip-in {
	from {
		transform: rotateX(90deg);
	}
	to {
		transform: rotateX(0deg);
	}
}
.full-screen-wrapper {
	z-index: 10;
	width: 100%;
	height: 100%;
	position: fixed;
	top: 0;
	left: 0;
}
.togglecheckbox {
	display: flex;
	flex: 100%;
	justify-content: center;
	align-items: center;

	label {
		color: #1C2128;
		font-size: 14px;
		padding:0 7px;
		
		&.label-text {
			font-size: 13px;
			color: #FBFBFB;
		}

		&:hover {
			cursor: pointer;
		}
	}
	.toggle-icon {
		position: relative;
		background: rgba(0,0,0,0.1);
		vertical-align: middle;
		display: inline-block;
		border-radius: 14px;
		width: 28px;
		height: 15px;
		transition: all .15s;

		&:hover {
			cursor: pointer;
		}

		&:before {
			content: "";
			border-radius: 12px;
			position: absolute;
			top: 1px;
			left: 1px;
			width: 12px;
			height: 12px;
			background: #fff;
			display: block;
			transition: left .15s;
			box-shadow: 0 2px 4px 0 rgba(0,0,0,.2), 0 0 1px 0 rgba(0,0,0,.21);
		}

		&.checked  {
			background:#64B448;

			&:before {
				left: 15px;
			}
		}
	}

	&:hover {
		cursor: pointer;
	}
}
.gutter, .gutter-v {
	width: 1px;
	height: 100%;
	background: #2D333B;
	position: relative;
	flex: 0 0 auto;

	&:after {
		content: "";
		display: block;
		height: 100%;
		width: 7px;
		position: absolute;
		left: -3px;
		z-index: 10;
	}

	&:hover {
		cursor: ew-resize;
	}
}
.gutter-v {
	width: 100%;
	height: 1px;

	&:after {
		width: 100%;
		height: 7px;
	}
	&:hover {
		cursor: ns-resize;
	}
}
.section-h{
	//display: flex;
	//flex: 1 1 auto;
	//overflow: hidden;
	position: relative;
}
.section-v {
	overflow: hidden;
}
.section-h {
	flex-direction: column;
}
.render {
	opacity: 0.5;
	position: relative;
}
.render-width {
	position: absolute;
	top: 4px;
	left: 4px;
	background: #20262E;
	border-radius: 4px;
	display: inline-block;
	padding: 4px;
	font-size: 12px;
	color: #fbfbfb;
	border: #2D333B solid 1px;
}
.input-group {
	display: flex;
	flex-direction: row;

	& select {

		& option {

		}
	}
	& button {
		margin: 0 0 0 5px;
		height: 33px;
	}
}
.editor_tabs {
	border-top:#2D333B solid 1px;
	display: flex;
	flex-direction: row;
	background: #1C2128;
}
.editor_tabs_item {
	padding:0 28px;
	color:#fbfbfb;
	border-top: #1C2128 solid 1px;
	border-right: #2D333B solid 1px;

	& p {
		font-size: 14px;
		color: #62666c;
	}

	&:hover {
		cursor: pointer;
	}

	&.active {
		background: #282a2e;
		border-top: #64B448 solid 1px;

		& p {
			color: #fbfbfb;
		}
	}
}
.section-heading {
	position: relative;
	background: #282a2e;
	padding: 0 7px;
	font-size: 13px;
	text-transform: uppercase;
	height: 37px;
	display: flex;
	flex-direction: row;
	align-items: center;

	&:hover {
		cursor: pointer;
	}

	& span{
		color:#8e9195;
		position: relative;

		/* &:before {
			content: '';
			position: absolute;
			border-left: 5px solid transparent;
			border-right: 5px solid transparent;
			border-top: 5px solid #8e9195;
			right : -21px;
			top: 4px;
		} */
	}
}
.compile {
	position: relative;
	& p {

	}
}
.modal_wrapper {
	position: fixed;
	top:0;
	left:0;
	width: 100%;
	height: 100%;
	border:red solid 1px;
	z-index: 999;
}
.modal {
	padding: 14px;
	top: 50%;
	left: calc(50% - 125px);
	position: absolute;
	background: #FBFBFB;
	border-radius: 7px;
	width: auto;
	-webkit-box-shadow: 1px 5px 10px 2px rgba(0,0,0,0.2);
	box-shadow: 1px 5px 10px 2px rgba(0,0,0,0.2);

	& h4 {
		color:#2D333B;
	}

	& .action {
		display: flex;
		justify-content: space-between;
	}
}
.toast {
	display: flex;
	flex-direction: row;
	align-items:center;
	justify-content: space-around;
	z-index: 4;
	position: fixed;
	padding: 3px;
	top: 0;
	left: 45%;
	width: 200px;

	&.alert-success {
		background: #64B448;
	}
	&.alert-error {
		background: #FB3535;
	}

	& svg {
		color:#fbfbfb;

		&:hover {
			cursor: pointer;
		}
	}
}
.pseudo_editor {
	width: 100%;
	height: 100%;
	background: #1D1F21;
	overflow-y: auto;

	& pre {
		margin: 0;
		word-break: break-all;
		word-wrap: break-word;
		font-size: 13px;
		color:#8e9195;
	}
}
.modal-form-content {
	z-index: 4;

	& label {
		font-size: 13px;
	}

	& .form-section {
		display: flex;
		justify-content: space-between;

		&>* {
			font-size: 13px;
			padding: 4px;
			margin:7px 0 14px;
		}
	}
}
.modal {
	&.leftdir {

		&:before {
			content: '';
			position:absolute;
			top: 24px;
			left:-7px;
			width: 14px;
			height: 14px;
			transform: rotate(45deg);
			background: #FBFBFB;
		}
	}

	& select {
		padding: 7px;
	}

	& input {
		font-size: 13px;
		padding: 4px 7px;
	}
}
.error_submit {
	color:#FB3535;
}
.submit-styled {
	background: none;
	border:none;
	display: flex;
	justify-content: flex-start;
	align-items: center;

	& svg {
		color: #F2EFE8;
		font-size: 18px;
	}

	&:hover {
		cursor: pointer;

		& svg {
			color: #66E994;
		}
	}

	& p, span {
		padding: 0 0 0 10px;
		font-size: 14px;
	}

	&:focus {
		outline: none;
	}
}
.data-source-params {
	display: flex;
	justify-content: space-between;

	& input:nth-child(2) {
		margin-left:7px;
	}
}
.action {
	margin-top: 14px;
}
.search-input {
	background: none;
	border:none;
	border-bottom: #2D333B solid 1px;
	margin-left: 21px;
	font-size: 14px;
	color: #FBFBFB;

	&:focus {
		outline: none;
	}
}
.small_card {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 6px 7px;
	border-radius: 4px;
	background: #64B448;
	margin: 0 0 14px 0; 

	p {
		margin: 0;
		padding: 0;
		width: 90%;
		word-break: break-all;
		// overflow: hidden;
	}

	svg {
		color: #FBFBFB;
		font-size: 12px;
		
		&:hover {
			cursor: pointer;
		}
	}
}
</style>
