// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import { store } from "./store";

import './common/globalVariables';
// import './plugins/socketPlugin';  //socket use

// font-awesome for vue
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faExclamation, faUserCog, faCommentDots, faCloudUploadAlt,
  faSpinner, faCommentAlt, faEyeSlash, faBars, faSearch, faListUl, faChevronCircleUp
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faExclamation, faUserCog, faCommentDots, faCloudUploadAlt, faSpinner, faCommentAlt,
  faEyeSlash, faBars, faSearch, faListUl, faChevronCircleUp)
Vue.component('font-awesome-icon', FontAwesomeIcon)



import Directives from './plugins/directives';
Vue.use(Directives);

import axios from "axios";

const base = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com"
});
Vue.prototype.$http = base;
Vue.prototype.$EventBus = new Vue();
Vue.config.productionTip = false;

// import { Kakao } from "./vendors/kakao.min.js";
import 'jquery';
import 'expose-loader?$!expose-loader?jQuery!jquery'

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import "chart.js";

// kakao login & JavaScript Key
Kakao.init('aa310add55217b47727f8374a302f5c2');

// Setup Firebase
const config = {
  apiKey: "AIzaSyB08IMhXI50LtpvzXITA4tQZZZWsAx3Py4",
  //apiKey: "AAAAJERPPYs:APA91bFRcmBz5EqEIO-_HlNX7XHsV-9i4GF_Al4SpgkBQvkbcdSezSrex3QpMvQmHGr1Y7Ftn_-Ku8Uv6P-7AWUsJeMRlYObtDFD6CHPkXCgnqs_UgJOInT0eXHkWlsUq2Dg9uab9yog",
  authDomain: "model-vue-data.firebaseapp.com",
  databaseURL: "https://model-vue-data.firebaseio.com",
  projectId: "model-vue-data",
  storageBucket: "model-vue-data.appspot.com",
  messagingSenderId: "155764866443"
};

import firebase from 'firebase/app';
firebase.initializeApp(config);
import 'firebaseui';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/messaging';
const dbFireStore = firebase.firestore();
//dbFireStore.settings({ timestampsInSnapshots: true });
firebase.auth().languageCode = 'kr';
// 구글 Auth계정 지속성 설정
const googleAuthPersistence = firebase.auth.Auth.Persistence.SESSION;

Vue.prototype.$firebase = firebase;
Vue.prototype.$firebaseUi = new firebaseui.auth.AuthUI(firebase.auth());
Vue.prototype.$googleAuthProvider = new firebase.auth.GoogleAuthProvider();
Vue.prototype.$setPersistence = firebase.auth().setPersistence(googleAuthPersistence);
Vue.prototype.$firebaseDB = dbFireStore;
Vue.prototype.$firebaseRealDB = firebase.database();
Vue.prototype.$firebaseStorage = firebase.storage();

//firebase cloud message사용시 https로 surving되어야 한다.
// 서비스워커 지원 유뮤 체크
if (navigator.userAgent.toLowerCase().indexOf('safari') === -1) {
  let firebaseMessage = firebase.messaging();
  //console.log('firebaseMessage', firebaseMessage)
  firebaseMessage.usePublicVapidKey("BDLf2pX2_o8PrF4u9ijiqBSqcLSVErhEupGktUpry2VNShqPQy63t38_-4l5vWnVQ8jmlxTfq_Rx7WYYixgTZAU");
  Vue.prototype.$fireMessage = firebaseMessage;
}

if ('serviceWorker' in navigator) {

}

new Vue({
  el: "#app",
  router,
  store,
  components: { App },
  template: "<App/>",
});


