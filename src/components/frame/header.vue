<template>
  <header>
		<div class="navbar navbar-dark bg-dark box-shadow">
			<div class="container d-flex justify-content-between">
				<router-link :to="gotoMainLink" class="navbar-brand d-flex align-items-center logo">
					<img src="../../assets/logo.png">
					<strong>Jongjin</strong>
				</router-link>
        <quick-menu />
			</div>
		</div>
	</header>
</template>

<script>
import quickMenu from "./quickMenu.vue";
export default {
  name: "Header",
  data() {
    return {
      gotoMainLink: "/",
    };
  },
	methods:{

	},
  components:{
    "quick-menu":quickMenu
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

*:focus{
  box-shadow:none !important;
}
</style>
