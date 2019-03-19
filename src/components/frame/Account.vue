<template>
  <div class="d-inline-block align-middle logined" v-if="isUserLogin" >
    <!--<button class="badge badge-light" @click="modifyUserInfo">회원정보 수정</button>-->
    <button class="badge badge-success" @click="logout">로그아웃</button>
    <span :style="'background-image: url(' + connectUserData.photoURL + ');'" class="pic rounded-circle"></span>
    <small class="text-white">[ {{ connectUserData.displayName }} ] 접속중...</small>
  </div>
  <div class="d-inline-block align-middle" v-else >
    <button class="badge badge-light badge" @click="signUp">회원가입</button>
    <button class="badge badge-success" @click="openLoginPopup">로그인</button>
  </div>
</template>
<script>
  import { USER_DATA } from '@/common/Constant.js';
  import { mapState, mapMutations, mapActions } from "vuex";

  export default {
    name:'Account',
    data(){
      return{
        fromLogin:false,
      }
    },
    computed:{
      ...mapState({
        connectUserData: ({ socket }) => socket.connectedUserData,
        isUserLogin: ({ socket }) => socket.isUserLogin,
      })
    },
    created(){
      console.log('Amount created')
      this.onChangeAuthAccount();
      this.$EventBus.$on('openLoginPopup', this.openLoginPopup);
      this.$EventBus.$on('onSaveUserIndexedDB', this.saveUserAtIndexedDB); //신규 User를 IndexedDB에서 체크 후 저장
      this.$EventBus.$on('onTypeAuth', $payload => this.fromLogin = $payload);

    },
    mounted(){
      //console.log('Amount mounted')
    },
    methods:{
      ...mapActions([
        'setCurrentUserData',
        'setIsUserLogin'
      ]),
      ...mapMutations(['currentUserInfo']),

      showModalpopup(title, componentName){
        window.globalVars.pop_title = title;
        window.globalVars.pop_content = componentName;
        this.$EventBus.$emit('toggleClose');
      },

      /** * User데이터를 IndexedDB에 저장 및 데이터 변경 */
      saveUserAtIndexedDB(user, isSave){
        console.log('saveUserAtIndexedDB', user, isSave)
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
              // let tmpUserData = {
              //   uid: user.uid,
              //   email: user.email,
              //   profileImg: user.photoURL,
              //   userName: user.displayName,
              // }
              // vm.currentUserInfo(tmpUserData); //vuex store에 접속자 정보 저장
              console.log('IndexedDb query 결과', data);

              // 데이터가 없으면 저장
              if(!data){
                console.log('data없을시')
                store.put({
                  uid: user.uid,
                  email: user.email,
                  photoURL : user.photoURL ? user.photoURL : '',
                  displayName : user.userName ? user.userName : user.displayName,
                  isSave: false
                })
              }

              // 데이터가 존재하고 isSave 파라미터 true이면 데이터를 업데이트
              if(data && isSave){
                console.log('data 존재하고 isSave이면 데이타 업데이트', data)
                store.put({
                  uid: user.uid,
                  email: user.email,
                  photoURL : user.photoURL ? user.photoURL : '',
                  displayName : user.userName ? user.userName : user.displayName,
                  isSave: true
                })
              }

              tranSaction.oncomplete = function(){
                console.log('IndexedDb 트랜잭션 완료')
                //vm.checkAndSaveUser(user) //호출할 적절한 위치 찾기 2019.03.04
                db.close();


              }
            }
          }
        }
      },

      //신규 유저를 indexDB에서 체크 후 저장
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
            console.log('checkAndSaveUser user', user, user.uid)
            store.get(user.uid).onsuccess = function(event) {
              let data = event.target.result;
              console.log('신규유저 체크', data)
              if(data !== undefined){
                if(!data.isSave){
                  vm.saveUserAtRealDB(data);
                }
              }else{
                // 로그인시 진행
                vm.saveUserAtRealDB(user,true);
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
        let vm = this;
        let userDBRef = this.$firebaseRealDB.ref(USER_DATA.REAR_FIREDB_NAME +'/'+ USER_DATA.INDEXDB_STORE + '/'+ user.uid);
        userDBRef.once('value').then((dataSnapShot) =>{
          // User Ref에 데이터가 없을 경우 데이터 저장
          console.log('유저 정보 존재 유무:', dataSnapShot.hasChildren(), user.profileImg, user.userName)
          if (!dataSnapShot.hasChildren()) {
            let userData = {
              email: user.email,
              photoURL: user.photoURL ? user.photoURL : '',
              displayName : user.displayName
            }
            userDBRef.set(userData).then(()=>{
              console.log('cbUserAfterSave completed!!!')
              vm.saveUserAtIndexedDB(user, true);
              //if (location.hash.split('/')[1] == 'chat') window.location.reload(true);
            }).catch((error)=>{
              console.log('realDB error',  error)
            });
          }
        });
      },

      onChangeAuthAccount(){
        const vm = this;
        console.log('account onChangeAuthAccount mehods')
        // 로그인후 접속 정보를 로컬에 저장하고 onAuthStateChanged함수를 실행한다.
        // 페이지 리로딩 후 현재 접속자의 정보가 로컬에 저장되어있는지 확인 후 저장되어 있다면 로컬정보를 가져오고,
        // 저장되지 않았다면 서버에서 정보를 가져온다.
        if(sessionStorage.getItem('currentUser') !== null) {
          vm.setIsUserLogin(); //접속 상태를 store에 갱신
          vm.setCurrentUserData(JSON.parse(sessionStorage.getItem('currentUser')));
        }

        this.$firebase.auth().onAuthStateChanged(function(user) {
          console.log('account:: $firebase.auth통신후 user정보 가져오기')
          if (user) {
            console.log('logIn::onChangeAuthAccount', vm.isUserLogin)
            vm.$firebaseRealDB.goOnline(); // 데이터 베이스 명시적 온라인


            if(sessionStorage.getItem('currentUser') === null) {
              sessionStorage.setItem('currentUser', JSON.stringify(user));
              vm.setIsUserLogin(); //접속 상태를 store에 갱신
              vm.setCurrentUserData(user);
            }

            if(vm.fromLogin) vm.checkAndSaveUser(user);
            // 로그인 후 접속상태 정보를 사용하고자 하는 컴포넌트(router의 hash정보)에 보내기, 현재는 챗방 게이트에서 사용됨
            vm.$EventBus.$emit('currentConnectionStatus');

          } else {
            console.log('logOut::onChangeAuthAccount')
            if(vm.isUserLogin){
              vm.setIsUserLogin();
              vm.setCurrentUserData([]);
              sessionStorage.removeItem('currentUser')
            }
            console.log('sss', location.hash)
          }
        });
      },


      signUp(){
        this.showModalpopup('회원가입','singup');
      },
      modifyUserInfo(){
        this.showModalpopup('회원정보수정','modifyUserInfo');
      },
      openLoginPopup(){
        this.showModalpopup('로그인','login');
      },
      logout(){
        const vm = this;

        this.$firebase.auth().signOut().then(function() {
          if(confirm('로그아웃 하시겠습니까?')){
            if(vm.$firebaseRealDB){
              vm.$firebaseRealDB.goOffline(); // 데이터 베이스를 명시적으로 오프라인
            }
            vm.$firebaseRealDB.auth().signOut();
          }
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

