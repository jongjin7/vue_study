<template>
  <div class="d-inline-block align-middle logined" v-if="isLogined">
    <!--<button class="badge badge-light" @click="modifyUserInfo">회원정보 수정</button>-->
    <button class="badge badge-success" @click="logout">로그아웃</button>
    <span :style="'background-image: url(' + userPhoto + ');'" class="pic rounded-circle"></span>
    <small class="text-white" v-if="connectUserName !== null">[ {{ connectUserName }} ] 접속중...</small>
  </div>
  <div class="d-inline-block align-middle" v-else>
    <button class="badge badge-light badge" @click="signUp">회원가입</button>
    <button class="badge badge-success" @click="login">로그인</button>
  </div>
</template>
<script>
  import { USER_DATA } from '../../common/Constant.js';
  export default {
    name:'Account',
    data(){
      return{
        isLogined:false,
        connectUserName:null,
        userPhoto:null,
        userEmail:null,
      }
    },
    created(){
      this.connectMemberCheck();

    },
    methods:{
      showModalpopup(title, componentName){
        this.showModal = true;
        window.globalVars.pop_title = title;
        window.globalVars.pop_content = componentName;
        this.$EventBus.$emit('toggleClose');
      },

      saveToStorageMemInfo(name,email,photo){
        sessionStorage.setItem('memberInfo',JSON.stringify({
          name:  name,
          email: email,
          photo: photo
        }));
      },

      /** * User데이터를 IndexedDB에 저장 및 데이터 변경 */
      saveUserAtIndexedDB(user, userName, userPic, isOauth){
        let isSave = false;
        let vm = this;

        if(indexedDB){
          let request = indexedDB.open(USER_DATA.INDEXDB_DB_NAME, USER_DATA.INDEXDB_VERSION);
          let objectName = USER_DATA.INDEXDB_STORE;

          // 데이터 베이스 생성 또는 버전 업그레이드
          request.onupgradeneeded= function(){
            let db = request.result;
            let store = db.createObjectStore(objectName, {keyPath:'uid'}); // 테이블에 해당하는 Object 생성 및 키값 설정
          }

          //DB접근요청 성공시
          request.onsuccess = function(){
            let db = request.result;
            let tranSaction = db.transaction(objectName, "readwrite"); //읽끼 쓰기 권한으로 트랜재션 얻음
            let store = tranSaction.objectStore(objectName);
            store.get(user.uid).onsuccess = function(event){
              let data = event.target.result;
              console.log('IndexedDb query 결과', data)
              window.globalVars.currentUserName = userName;
              //console.log('saveUserAtIndexedDB isSave 파라메터', isSave )

              // 데이터가 없으면 저장
              if(!data){
                //console.log(store)
                store.put({
                  uid: user.uid,
                  email: user.email,
                  photoURL: userPic,
                  displayName: userName,
                  isSave: false
                })
              }

              // 데이터가 존재하고 isSave 파라미터 true이면 데이터를 업데이트
              if(data && isSave){
                store.put({
                  uid: user.uid,
                  email: user.email,
                  photoURL: userPic,
                  displayName: userName,
                  isSave: true
                })
              }

              tranSaction.oncomplete = function(){
                return new Promise((resolve,reject)=>{
                  console.log('IndexedDb 트랜잭션 완료')
                  db.close();

                  resolve()
                }).then(()=>{
                  console.log('....')
                  vm.checkAndSaveUser(user);
                })
              }
            }
          }
        }
      },

      checkAndSaveUser(user){
        try{
          let vm = this;
          let request = indexedDB.open(USER_DATA.INDEXDB_DB_NAME, USER_DATA.INDEXDB_VERSION);
          let objectName = USER_DATA.INDEXDB_STORE;

          request.onsuccess = function(){
            let db = request.result;
            let tranSaction = db.transaction(objectName, "readwrite");
            let store = tranSaction.objectStore(objectName);

            // indexedDB에서 데이터 읽어오기
            store.get(user.uid).onsuccess = function(event) {
              let data = event.target.result;

              if(!data.isSave){
                vm.saveUserAtRealDB(data);
              }
            }

            tranSaction.oncomplete = function(){
              console.log('checkAndSaveUser IndexedDb 트랜잭션 완료')
              db.close();
            }
          }
        }catch(e){
          //indexDB 확인에 실패 하면 Reatime Database 조회 후 저장
          console.log('catch!!!!')
          this.saveUserAtRealDB(user);
        }
      },

      //Realtime Database에서 Users 데이터를 체크 후 저장
      saveUserAtRealDB(user){

        let userDBRef = this.$firebaseRealDB.ref(USER_DATA.REAR_FIREDB_NAME +'/'+ USER_DATA.INDEXDB_STORE + '/'+ user.uid);
        userDBRef.once('value').then((dataSnapShot) =>{
          // User Ref에 데이터가 없을 경우 데이터 저장
          console.log('유저 정보 존재:', dataSnapShot.hasChildren())
          if (!dataSnapShot.hasChildren()) {
            userDBRef.set({
              //데이터 저장
              email: user.email,
              profileImg: user.photoURL,
              userName : user.displayName
            }).then(()=>{
              console.log('cbUserAfterSave completed!!!')
            });
          }
        });
      },

      connectMemberCheck(){
        const vm = this;
        this.$firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            console.log('signed in')
            // uid 전역 변수에 할당
            window.globalVars.currentUserUID = user.uid;

            user.providerData.forEach(function (profile) {
              console.log("Sign-in provider: " + profile.providerId);
              console.log("  Provider-specific UID: " + profile.uid);
              console.log("  Name: " + profile.displayName);
              console.log("  Email: " + profile.email);
              console.log("  Photo URL: " + profile.photoURL);

              vm.isLogined = true;

              if(profile.providerId == 'password'){
                // Cloud Firestore Database
                vm.$firebaseDB.collection('members').where('email','==',profile.email)
                  .onSnapshot(function(querySnapshot) {

                    querySnapshot.forEach(function(doc) {

                      vm.connectUserName = doc.data().name;
                      vm.userEmail = doc.data().email;
                      vm.userPhoto = doc.data().photo;
                      // indexedDB test
                      vm.saveUserAtIndexedDB(user, vm.connectUserName, vm.userPhoto)
                      // session storage
                      vm.saveToStorageMemInfo(vm.connectUserName, vm.userEmail, vm.userPhoto);
                    });
                  });

              }else if(profile.providerId =='google.com'){
                vm.connectUserName = profile.displayName;
                vm.userEmail = profile.email;
                vm.userPhoto = profile.photoURL;

                //Realtime Database
                vm.saveUserAtIndexedDB(user, vm.connectUserName, vm.userPhoto)

                //session storage
                vm.saveToStorageMemInfo(vm.connectUserName, vm.userEmail, vm.userPhoto);
              }
            });

          } else {
            console.log('signed out!')
            // User is signed out.
            vm.isLogined = false;
            vm.email = null;
            vm.photo = null;
            vm.connectUserName = null;
          }
        });

        this.$EventBus.$on('loginPop', this.login);
      },


      signUp(){
        this.showModalpopup('회원가입','singup');
      },
      modifyUserInfo(){
        this.showModalpopup('회원정보수정','modifyUserInfo');
      },
      login(){
        this.showModalpopup('로그인','login');
      },
      logout(){
        const vm = this;

        this.$firebase.auth().signOut().then(function() {
          alert('로그아웃 되었습니다.');
          sessionStorage.removeItem('memberInfo');
          if(location.hash.split('/')[1] == 'chat') vm.$router.push('/');
        }).catch(function(error) {
          // An error happened.
        });
      }

    }
  }
</script>
<style lang="scss" scoped>
  .logined{
    .pic{
      display: inline-block;
      width:20px; height:20px;
      background-size: cover;
      background-position: center center;
      background-repeat:no-repeat;
      vertical-align: middle;
    }
  }
  .badge{
    cursor: pointer;
    border:none;

    &:hover{
      opacity: 0.9;
    }
  }
</style>

