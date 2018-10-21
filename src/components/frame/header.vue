<template>
  <header>
		<div class="navbar navbar-dark bg-dark box-shadow">
			<div class="container d-flex justify-content-between">
				<router-link :to="gotoMainLink" class="navbar-brand d-flex align-items-center logo">
					<img src="../../assets/logo.png">
					<strong>Jongjin</strong>
				</router-link>

				<div class="dropdown" :class="{ show: showGnb }">
					<button class="navbar-toggler" type="button" data-toggle="collapse" @click="showGnb = !showGnb">
						<span class="navbar-toggler-icon"></span>
					</button>
					
					<div id="" class="dropdown-menu" v-bind:class="{ show: showGnb }">
						<a class="dropdown-item" href="111111" v-on:click="clickSubMenu">Menu1</a>
						<a class="dropdown-item" href="2222" @click.stop.prevent="showGnb = false">Menu2</a>
						<a class="dropdown-item" href="http://www.naver.com" target="_blank" v-on:click.stop.prevent="clickSubMenu">Menu3</a>
						<div class="dropdown-divider"></div>
						<a class="dropdown-item" href="#">subMenu1</a>
						<a class="dropdown-item" href="#">subMenu2</a>
					</div>
				
				</div>
			</div>
		</div>
	</header>
</template>

<script>
export default {
  name: "Header",
  data() {
    return {
      gotoMainLink: "/",
			showGnb: false,
    };
  },
	methods:{
		clickSubMenu : function(e){
			console.log(e.target)
			this.showGnb = false
		},
	}
};
</script>

<style lang='scss'>
.logo {
  width: 30px;
  text-align: center;
  text-decoration: none;

  img {
    display: block;
    width: 100%;
    vertical-align: middle;
  }
}
main{
	padding-top:10px;

	p{
		padding:0 !important;
	}
}
</style>
