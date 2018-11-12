<template>
  <div class="jumbotron">
    <h1><span class="name">{{ msg }}</span>님! 안녕하세요.<br>접속을 환영합니다.</h1>
    <p>
      이 웹앱은 사이트의 기본 기능 중심으로 페이지를 구성하였다.
      Front-End는 부트스트랩4.x으로 화면구성, VueJs로 화면 UI 및 비지니스 로직을 개발하였다.<br>
      Back-End는 Google BaaS(Backend as a Service) Firebase Database의 한 종류(NoSQL)인 Cloud Firestore를,
      Resource는 Firebase Storage를 이용하여 데이터를 연동하였다. <button class="btn btn-sm">더보기...</button>
    </p>
    <hr class="mt-2 mb-2">
    <p>
      BaaS란 Backend as a Service이다. IaaS나 PaaS가 전통적인 서버 인프라를 대체 하는 수준이었다면
      BaaS, FaaS는 조금 더 나아가서 서버 운영 자체를 대행해주는 수준까지 발전한 것이다.
      인디 앱 개발자들은 웬만한 서버 기능들은 실제 서버구성 없이도 데모나 알파테스트가 가능한 서비스를 만들 수 있을 것이다.
    </p>
  </div>
</template>
<script>
export default {
  name: "bannerAbout",
  data() {
    return {
      msg: "홍길동"
    };
  }
};
</script>
