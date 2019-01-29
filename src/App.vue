<template>
  <div id="app">
    <common-header></common-header>
    <main>
      <div class="container">
        <router-view/>
        <hr class="featurette-divider">
      </div>
    </main>
    <common-footer></common-footer>
  </div>
</template>

<script>

import header from "./components/frame/header.vue";
import footer from "./components/frame/footer.vue";

export default {
  name: "App",
  data() {
    return {};
  },
  created(){
    //this.$EventBus.$on('signin', this.watchLogined)
    this.watchLogined();
  },
  methods:{
    watchLogined(arg){
      console.log('logined onAuthStateChanged')
     // this.$router.push('/')
      this.$firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
          let userData ={
            name: user.displayName,
            email: user.email,
            emailVerified: user.emailVerified,
            photoURL: user.photoURL,
            isAnonymous: user.isAnonymous,
            uid: user.uid,
            providerData: user.providerData
          }

          sessionStorage.setItem('memberInfo',JSON.stringify(userData));


          console.log("  isAnonymous: " + user.isAnonymous);

          user.providerData.forEach(function (profile) {
            console.log("Sign-in provider: " + profile.providerId);
            console.log("  Provider-specific UID: " + profile.uid);
            console.log("  Name: " + profile.displayName);
            console.log("  Email: " + profile.email);
            console.log("  Photo URL: " + profile.photoURL);
          });
          // ...
        } else {
          // User is signed out.
          // ...
        }
      });
    }
  },
  components: {
    "common-header": header,
    "common-footer": footer
  }
};
</script>

<style lang="scss">
  .invalid-feedback{
    display: block;
  }

  ::placeholder { /* 파이어폭스 51+, 크롬 57+ */
    color:#888 !important;
  }
  :-ms-input-placeholder { /* 인터넷 익스플로러 10+ */
    color:#888 !important;
  }

</style>
