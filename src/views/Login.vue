<template>
	<div id="main">
		<div class="main-container">
			<div class="align-center">
				<div class="login-container">
					<div class="login-heading">
						<h3>Welcome</h3>
					</div>
					<div class="login-content">
						<form action="">
							<input type="text" v-model="username" placeholder="Username">
							<input type="password" v-model="password" placeholder="Password">
							<div class="login-actions">
								<input type="submit" @click.prevent="login" value="Login" class="login-button">
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	data () {
		return {
			username: '',
			password: ''
		}
	},
	methods: {
		login () {
			const credentials = {
				'Username': this.username,
				'Password': this.password
			}

			this.$store.dispatch('login', credentials).then(response => {
				console.log(response)
				this.$router.push('/')
			})
		}
	}
}
</script>
<style lang="scss">
.align-center {
	display: flex;
	flex: 100%;
	height: 100%;
	justify-content: center;
	align-items: center;
}
.login-container {
	display: flex;
	width: 322px;
	flex-direction: column;
}
.login-heading {
	display: flex;
	flex: 100;
	margin: 21px;
	justify-content: center;
}
.login-content {
	flex: 1;
	display: flex;
	flex-direction: column;

	& input[type=text], & input[type=password] {
		box-sizing: border-box;
		width: 100%;
		background: #1B2027;
		border:#2D333B solid 1px;
		padding:14px;
		margin-bottom: 7px;
		color: #FBFBFB;
	}

	.login-button {
		color: #ffffff;
		cursor: pointer;
		background: #64B448;
		font-size: 14px;
		font-weight: 700;
		border: none;
		height: 42px;
		padding: 0 21px;
		border-radius: 3px;
	}
}
.login-actions {
	display: flex;
	flex: 100;
	margin-top: 42px;
	justify-content: center;
}
</style>
