<template>
	<div class="modal">
		<h4>{{message}}</h4>
		<div class="action">
			<button class="btn btn-green" @click="yes">Yes</button>
			<button class="btn btn-grey" @click="no">Cancel</button>
		</div>
	</div>
</template>
<script>
export default {
	props: ['message', 'note'],
	data () {
		return {

		}
	},
	methods: {
		yes () {
			this.$emit('modalResponse', { resp: true, note: this.note })
		},
		no () {
			this.$emit('modalResponse', { resp: false, note: this.note })
		}
	}

}
</script>
<style lang="scss">

</style>
