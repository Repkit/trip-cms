<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Roboto:400,700');
body, html {
	margin:0;
	padding :0;
	height: 100%;
	font-family: 'Roboto', sans-serif;
}
p, span, a, h1, h2, h3, h4, h5, h6 {
	color: #FBFBFB;
}
p {
	font-size: 13px;
	font-weight: 400;
}
#app {
	margin: 0;
	padding: 0;
	display: flex;
	min-height: 100%;
}
</style>
