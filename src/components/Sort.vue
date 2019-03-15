<template>
<div>
	<div class="full-screen-wrapper" @click.self="isActive = false" v-show="isActive"></div>
	<div class="input-group sort-container">
		<input type="text" v-model="filter" @focus="isActive = true">
		<button class="btn btn-green" @click.prevent="InsertSnippet">Add</button>
		<ul class="sort-list" v-show="isActive" >
			<li v-for="(item, i) in Sortedpayload" :key="i">
				<p class="category" v-if="ShouldDisplayCategoryHeading(i)">{{item.Category}}</p>
				<p class="item" @click="SelectItem(item)">{{item.Name}}</p>
			</li>
		</ul>
	</div>
</div>
</template>
<script>
export default {
	props: {
		payload: {},
		sortBy: {
			type:String
		},
	},
	data() {
		return {
			filter: '',
			isActive: false,
			selectedObj: {}
		}
	},
	methods: {
		ShouldDisplayCategoryHeading: function(i) {
			if (i === 0) return true;
			if (this.Sortedpayload[i].Category !== this.Sortedpayload[i-1].Category) return true;
			return false;
		},
		InsertSnippet() {
			this.$emit('requestInsertSnippet', this.selectedObj)
			this.filter = ''
		},
		SelectItem(val) {
			this.selectedObj = val
			this.filter = val.Name
			this.isActive = false
		},
		/* 
		ShouldDisplayCategoryHeading: function(i) {
			if (i === 0) return true;
			if (this.payload[i].Category !== this.payload[i-1].Category) return true;
			return false;
		},
		SelectItem(val) {
			this.selectedObj = val
			this.filter = val.Name
			this.isActive = false
		}, */
	},
	computed: {
		Sortedpayload: function() {
			var bucket = this.payload.slice(0);
			var pattern = new RegExp(this.filter, 'i');
			bucket = bucket.filter(function(payload) {
				return payload.Category.match(pattern) != null || payload.Name.match(pattern);
			}.bind(this));

			return bucket.sort(function(a, b){
				return a.Category.localeCompare(b.Category);
			});
		}
	}
}
</script>
<style lang="scss">
</style>