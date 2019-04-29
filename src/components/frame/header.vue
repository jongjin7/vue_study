<template>
  <header>
		<div class="navbar bg-dark head-top">
			<div class="container d-flex justify-content-between">
        <div class="lft">
          <router-link :to="gotoMainLink" class="navbar-brand align-items-center logo mr-2 text-white">
            <img src="../../assets/logo.png">
            <strong>Jongjin</strong>
          </router-link>
        </div>
        <commonQuickMenu />
			</div>
		</div>
    <commonAccount />
	</header>
</template>

<script>
import commonQuickMenu from "./quickMenu.vue";
import commonAccount from "./Account.vue";

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
    commonQuickMenu,
    commonAccount
  }
};
</script>

<style lang='scss'>
header{
  line-height:1;
  .head-top{
    padding:0.25rem 1rem;
  }
  .container{

  }
  .logo {
    text-align: center;
    text-decoration: none;
    margin-right: 0;

    img {
      width: 30px;
      vertical-align: middle;
    }
  }

  @media (max-width:480px){
    .container{
      padding-left: 0;
      padding-right: 0;
    }
  }
}

main{
	padding-top:10px;
}

*:focus{
  box-shadow:none !important;
}
</style>
