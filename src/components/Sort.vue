<template>
<div>
	<div class="full-screen-wrapper" @click.self="isActive = false" v-show="isActive"></div>
	<div class="input-group sort-container">
		<input type="text" v-model="filter" @focus="isActive = true">
		<button class="btn btn-green" @click.prevent="InsertSnippet">Add</button>
		<ul class="sort-list" v-show="isActive" >
			<li v-for="(item, i) in sortedData" :key="i">
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
		data: {},
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
		InsertSnippet() {
			this.$emit('requestInsertSnippet', this.selectedObj)
			this.filter = ''
		},
		ShouldDisplayCategoryHeading: function(i) {
			if (i === 0) return true;
			if (this.data[i].Category !== this.data[i-1].Category) return true;
			return false;
		},
		SelectItem(val) {
			this.selectedObj = val
			this.filter = val.Name
			this.isActive = false
		},
	},
	computed: {
		sortedData: function() {
			let bucket = this.data.slice(0);
			let pattern = new RegExp(this.filter, 'i');
			bucket = bucket.filter(function(snippet) {
				return snippet.Category.match(pattern) != null || snippet[this.sortBy].match(pattern);
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