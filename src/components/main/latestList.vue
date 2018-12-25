<template>
  <div class="row text-center latest-list">
    <!-- 커뮤니티 게시물 추출 -->
    <div class="col-md-4 mb-4" v-for="item in getData.community" >
      <div class="card box-shadow">
        <router-link :to="'/community-detail/'+item.id"><figure class="card-img-top" :style="'background-image:url('+ item.imagePath + ')'"></figure></router-link>
        <div class="card-body text-left">
          <p>{{ item.title }}</p>
          <router-link class="btn btn-secondary btn-sm" :to="'/community-detail/'+item.id">자세히 보기 »</router-link>
        </div>
      </div>
    </div>

    <!-- 갤러리 게시물 추출 -->
    <div class="col-md-4 mb-4" v-for="item in getData.gallery">
      <div class="card box-shadow">
        <router-link :to="'/photo'"><figure class="card-img-top" :style="'background-image:url('+ item.imagePath + ')'"></figure></router-link>
        <div class="card-body text-left">
          <p>{{ item.title }}</p>
          <router-link class="btn btn-secondary btn-sm" :to="'/photo'">갤러리 메인 »</router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "latestList",
  data() {
    return {
      getData:{
        community:[],
        gallery:[]
      },
    };
  },
  created(){
    this.getDataToServerCommunity();
    this.getDataToServerGallery();
  },
  methods:{
    getDataToServerCommunity(){
      const vm = this;
      const currentTime = this.$firebase.firestore.Timestamp.fromDate(new Date()).seconds;
      console.log('currentTime Seconds ==>'+ currentTime)
      const dataCollectionCommunity = this.$firebaseDB.collection('community').doc('content').collection('community-data');



      dataCollectionCommunity
        .where('strTimeStamp', '>', 1545226255)
        //.orderBy('strTimeStamp')
        //.startAt(currentTime - 50000)
        //.endAt(currentTime - 1200)
        .get()
        .then((querySnapshot) => {
          //DB에서 질의에 맞는 데이타를 받은 후... 클라이언트에서 처리할 수 있도록 데이터를 넘겨줌
          let arrResponseData = [];
          querySnapshot.forEach((doc) => {
            //console.log('imgTag',doc.data().id, doc.data().strTimeStamp, currentTime  - doc.data().strTimeStamp, vm.getData.length)
            arrResponseData.push(doc.data())
          });
          arrResponseData.reverse();
          return arrResponseData;
        })
        .then((arrResponseData)=>{
          // data에 할당
          let regExpImgTag = /<img[^>]*src=[\"']?([^>\"']+)[\"']?[^>]*>/g;
          let regExpSrc = /src=[\"']?([^>\"']+)[\"']?[^>]\"/g;
          let regExpSrcData = /src=\"data:image\/([a-zA-Z]*);base64,([^\"]*)\"/g;
          // 현재 시간 0000초전까지의 데이터를 담기
          // let tmpFilter = arrResponseData.filter((arg)=>{
          //   return currentTime - arg.strTimeStamp < 50000;
          // });
          //
          // console.log('tmpFilter', tmpFilter)

          //본문 내용에 이미지 태그가 포함된 데이터만 다시 필터링
          for(let i = 0, lang = arrResponseData.length; i < lang; i++ ){
            //console.log('for', i, arrResponseData[i].strTimeStamp, arrResponseData[i].id, arrResponseData[i].body.match(regExpImgTag))
            if(arrResponseData[i].body.match(regExpImgTag)){
            //if(tmpFilter[i].body.indexOf('src=') > 0)
              //console.log('이미지 있는 내용', tmpFilter[i].body.match(regExpSrc)[0].replace('src=','').replace(/\"/g,' '))
              arrResponseData[i].imagePath = arrResponseData[i].body.match(regExpSrc)[0].replace('src=','').replace(/\"/g,' ');

              if(vm.getData.community.length < 2){
                vm.getData.community.push(arrResponseData[i]);
              }

              //console.log('condition'+[i]+'==>', vm.getData.community)
            }
          }
        });
    },
    getDataToServerGallery(){
      const vm = this;
      const dataCollectionGallery = this.$firebaseDB.collection('photo-gallery').doc('content').collection('gallery-data');
      dataCollectionGallery
        .where('strTimeStamp', '>', 1544726969)
        .get()
        .then((querySnapshot) => {
          let arrResponseData = [];
          querySnapshot.forEach((doc) => {
            //console.log('imgGallTag',doc.data().id, doc.data())
            arrResponseData.push(doc.data())
          });
          arrResponseData.reverse();
          return arrResponseData;
      })
      .then((arrResponseData)=>{
        // data에 할당
        if(vm.getData.gallery.length < 1){
          vm.getData.gallery.push(arrResponseData[0])
        }
      })
    },


  }
};
</script>
<style lang="scss" scoped>
  .latest-list{
    .card{
      height:100%;
      figure{
        padding-top: 80%;
        margin: 0;
        background-position: center center;
        background-repeat: no-repeat;
        background-size:cover;
      }
    }
    @media (max-width:767px) {
      .card{
        flex-direction:row;
        align-content: stretch;

        figure{
          width:50%; padding-top:40%;
          border-radius:0.2rem;
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
        }
        .card-body{
          width:50%;
          p{
            margin-bottom: 0.5rem;
          }
        }
      }

    }
  }
</style>
