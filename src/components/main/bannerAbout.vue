<template>
  <div class="jumbotron">

    <div v-if="isLocalUserData">
      <h1><span class="name text-primary">{{ userName }}</span>님!<br>문의하신 내용은 다음과 같습니다.</h1>
      <div class="pb-2">
        <p class="bg-light my-3 py-1 px-2" v-html="userMessage"><!-- 받은 메시지 --></p>
        <p>더 궁금하신 내용에 대해 문의를 주시면 성심성의(誠心誠意)껏 답변 드리겠습니다.<br>감사합니다.</p>
      </div>
      <!--<router-link :to="'/contact'" class="btn btn-sm btn-secondary">다시 문의하기</router-link>-->
      <button class="btn btn-sm btn-secondary" @click="resetBannerMsg">내용 지우기</button>
    </div>
    <div v-else>
      <h1><span class="name text-primary">{{ userName }}</span>님! 안녕하세요.<br>접속을 환영합니다.</h1>
      <p class="pb-2">
        이 웹 사이트는 게시판과 입력폼 기능 구현 중심으로 된 페이지롷 구성되어 있다.
        Front-End는 부트스트랩4.x으로 화면구성, VueJS로 화면 UI 및 비지니스 로직을 개발하였다.<br>
        Back-End는 Google BaaS(Backend as a Service) Firebase Database의 한 종류(NoSQL)인 Cloud Firestore를,
        Resource는 Firebase Storage를 이용하여 데이터를 연동하였다.
      </p>
      <div class="pt-3 pb-2" v-show="isMore">
        <h2 class="h4">학습 목적</h2>
        <p>VueJS에 대해 학습하기 위한 목적으로 평소 <i class="text-success">웹에서 맞주치는</i> 기능 위주로 페이지를 구성하였다. 가장 노멀한 기능 페이지를
          개발해보면서 자바스크립트 프레임웍을 이용한 개발 방식의 적응과 함께 단기간에 다양한 개발 이슈를 접함으로써 프론트 개발 능력을 쌓고자하는 목적이다.</p>
        <hr class="mt-2 mb-2">
        <p>
          BaaS란 Backend as a Service이다. IaaS나 PaaS가 전통적인 서버 인프라를 대체 하는 수준이었다면
          BaaS, FaaS는 조금 더 나아가서 서버 운영 자체를 대행해주는 수준까지 발전한 것이다.
          인디 앱 개발자들은 웬만한 서버 기능들은 실제 서버구성 없이도 데모나 알파테스트가 가능한 서비스를 만들 수 있을 것이다.
        </p>
      </div>
      <button class="btn btn-sm" @click="showMoreData">
        <span v-show="!isMore">더 보기</span>
        <span v-show="isMore">닫기</span>
      </button>
    </div>
  </div>
</template>
<script>
  const STORAGE_KEY_CONTACTUS = 'contact-us-message';

  export default {
    name: "bannerAbout",
    data() {
      return {
        isMore:false,
        oldUserName:'',
        userName: "홍길동",
        userMessage:'',
        isLocalUserData:false,
      };
    },
    created(){
      this.checkSentUserMessage();
    },
    methods:{
      showMoreData(){
        this.isMore = !this.isMore;
      },

      checkSentUserMessage(){
        let localUserData = localStorage.getItem(STORAGE_KEY_CONTACTUS);
        if(localUserData !== null){
          localUserData = JSON.parse(localUserData);
          this.oldUserName = this.userName;
          this.userName = localUserData.name;
          this.userMessage = localUserData.message.replace(/\n/g,'<br>');
          this.isLocalUserData = true;
        }
      },

      resetBannerMsg(){
        console.log('resetBannerMsg')
        this.userName = this.oldUserName;
        localStorage.removeItem(STORAGE_KEY_CONTACTUS);
        this.isLocalUserData=false;
      }
    }
  };
</script>
<style lang="scss" scoped>
  .jumbotron {
    padding: 2rem;
    h1 {
      .name {
      }
    }
    p{
      margin-bottom:0;
    }
    .btn{
      min-width:80px;
    }
  }
</style>
