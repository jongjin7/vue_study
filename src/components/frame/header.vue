<template>
  <header>
		<div class="navbar navbar-dark bg-dark box-shadow">
			<div class="container d-flex justify-content-between">
        <div class="lft">
          <router-link :to="gotoMainLink" class="navbar-brand align-items-center logo mr-2">
            <img src="../../assets/logo.png">
            <strong>Jongjin</strong>
          </router-link>

          <commonAccount />
        </div>

        <commonQuickMenu />
			</div>
		</div>
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
  .logo {
    text-align: center;
    text-decoration: none;
    margin-right: 0;

    img {
      width: 30px;
      vertical-align: middle;
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
