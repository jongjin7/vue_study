// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import { store } from "./store";

import './common/globalVariables';
// import './plugins/socketPlugin';  //socket use

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
  apiKey: "AIzaSyCV7xlKQfRLoBfgGYGF3Jpy9z48-oSgpX8",
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
const dbFireStore = firebase.firestore();
dbFireStore.settings({ timestampsInSnapshots: true });
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

new Vue({
  el: "#app",
  router,
  store,
  components: { App },
  template: "<App/>",
});


