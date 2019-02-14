<template>
	<div class="notification">
		<div class="notification-heading">
			<button class="btn btn-icon btn-icon-darkgrey">
				<font-awesome-icon :icon="['fas', 'times']"></font-awesome-icon>
			</button>
		</div>
		<div class="notification-content">
			<p>You are about to commit an action !</p>
		</div>
		<div class="notification-action">
			<button class="btn btn-grey">Action</button>
			<button class="btn btn-grey">Cancel</button>
		</div>
	</div>
</template>
<script>
export default {

}
</script>
<style lang="scss">
.notification {
	position: absolute;
	width: 343px;
	top: 45%;
	left: calc(50% - 171px);
	background: #FFFFFF;
	border-radius: 4px;
	padding: 14px;
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;

	& p {
		flex: 100%;
		margin: 0 0 14px;
		text-align: center;
		color:#39464E;
	}
}
.notification-heading {
	flex: 100%;
	display: flex;
	justify-content: flex-end;
	margin-bottom: 7px;
}
.notification-content {
	flex: 100%;
	justify-content: center;
	margin-bottom: 7px;
}
.notification-action {
	display: flex;
	flex: 100%;
	justify-content: center;

	& button {
		margin:0 7px;
	}
}
</style>
