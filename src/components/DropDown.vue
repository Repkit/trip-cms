<template>
	<div class="drop-down-modal">
		<div class="content">
			<div class="arrow-pointer" ref="arrowpointer"></div>
			<h3 class="title">{{name}}</h3>
			<template v-if="info === 'json'">
				<select @change="dataSource(selectedDataSource)" name="" id="" v-model="selectedDataSource">
					<option :value="item" v-for="(item, i) in datasource" :key="i">
						{{item.Name}}
					</option>
				</select>
			</template>
		</div>
    </div>
</template>
<script>
export default {
	props: ['reference', 'width', 'name', 'info'],
	data () {
		return {
			active: false,
			selectedDataSource: ''
		}
	},
	methods: {
		dataSource (item) {
			this.$store.dispatch('callApi', { method: 'GET', url: '/static-data/' + item.Name }).then((resp) => {
				this.$emit('emitDataSource', JSON.stringify(resp.data._embedded.cities))
			}).catch((err) => {
				console.log(err)
			})
		}
	},
	mounted () {
		this.$el.style.width = this.width + 'px'
		this.$el.style.left = 20 + 'px'
		this.$el.style.top = 40 + 'px'
		this.$refs.arrowpointer.style.left = 25 + 'px'
	},
	computed: {
		datasource () {
			return this.$store.getters.getDataSource
		}
	}
}
</script>
<style lang="scss">

</style>
