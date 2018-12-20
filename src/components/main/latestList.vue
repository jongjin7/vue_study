<template>
  <div class="row text-center latest-list">
    <div class="col-md-4 mb-4">
      <div class="card box-shadow">
        <figure class="card-img-top" :style="'background-image:url('+ latestList[0].imagePath + ')'"></figure>
        <div class="card-body text-left">
          <p>{{ latestList[0].title }}</p>
          <router-link class="btn btn-secondary btn-sm" :to="'/community-detail/'+latestList[0].id">자세히 보기 »</router-link>
        </div>
      </div>
    </div>
    <div class="col-md-4 mb-4">
      <div class="card box-shadow">
        <figure class="card-img-top" :style="'background-image:url('+ latestList[1].imagePath + ')'"></figure>
        <div class="card-body text-left">
          <p>{{ latestList[1].title }}</p>
          <router-link class="btn btn-secondary btn-sm" :to="'/community-detail/'+latestList[1].id">자세히 보기 »</router-link>
        </div>
      </div>
    </div>
    <div class="col-md-4 mb-4">
      <div class="card box-shadow">
        <figure class="card-img-top" :style="'background-image:url('+ latestList[2].imagePath + ')'"></figure>
        <div class="card-body text-left">
          <p>{{ latestList[2].title }}</p>
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
      getData:[],
      latestList:[
        {
          title:'',
          imagePath:'',
          id:''
        },
        {
          title:'',
          imagePath:'',
          id:''
        },
        {
          title:'',
          imagePath:'',
          id:''
        }
      ]
    };
  },
  created(){
    this.getDataToServerCommunity();
  },
  methods:{
    getDataToServerCommunity(){
      const vm = this;
      let currentTime = this.$firebase.firestore.Timestamp.fromDate(new Date()).seconds;
      console.log(currentTime)
      const dataCollectionCommunity = this.$firebaseDB.collection('community').doc('content').collection('community-data');
      dataCollectionCommunity
        .orderBy('strTimeStamp')
        .startAt(currentTime - 50000)
        //.endAt(currentTime - 1200)
        .get()
        .then((querySnapshot) => {
          //서버에서 데어터를 질의에 맞게 받은 후... 데이터를 넘겨줌
          let arrResponseData = [];

          querySnapshot.forEach((doc) => {
            console.log('imgTag',doc.data().id, doc.data().strTimeStamp, currentTime  - doc.data().strTimeStamp, vm.getData.length)
            arrResponseData.push(doc.data())
          });
          arrResponseData.reverse();
          console.log('community arrResponseData', arrResponseData)
          return arrResponseData;


        })
        .then((arrResponseData)=>{
          let regExpImgTag = /<img[^>]*src=[\"']?([^>\"']+)[\"']?[^>]*>/g;
          let regExpSrc = /src=[\"']?([^>\"']+)[\"']?[^>]\"/g;
          let regExpSrcData = /src=\"data:image\/([a-zA-Z]*);base64,([^\"]*)\"/g;
          // 현재 시간 0000초전까지의 데이터를 담기
          let tmpFilter = arrResponseData.filter((arg)=>{
            return currentTime - arg.strTimeStamp < 50000;
          });

          console.log('tmpFilter', tmpFilter)

          //본문 내용에 이미지 태그가 포함된 데이터만 다시 필터링
          for(let i = 0, lang = tmpFilter.length; i < lang; i++ ){
            console.log('for', i, tmpFilter[i].strTimeStamp, tmpFilter[i].id, tmpFilter[i].body.match(regExpImgTag))
            if(tmpFilter[i].body.match(regExpImgTag)){
            //if(tmpFilter[i].body.indexOf('src=') > 0)
              //console.log('이미지 있는 내용', tmpFilter[i].body.match(regExpSrc)[0].replace('src=','').replace(/\"/g,' '))
              tmpFilter[i].imagePath = tmpFilter[i].body.match(regExpSrc)[0].replace('src=','').replace(/\"/g,' ');

              if(vm.getData.length < 2){
                vm.getData.push(tmpFilter[i]);
              }
              else{
                vm.getDataToServerGallery();
              }
              console.log('condition'+[i]+'==>', vm.getData)
            }else{

            }
          }
        });
    },
    getDataToServerGallery(){
      //console.log('getDataToServerGallery')
      const vm = this;
      const dataCollectionGallery = this.$firebaseDB.collection('photo-gallery').doc('content').collection('gallery-data');
      dataCollectionGallery
        .orderBy('timeStamp')
        //.where('id','>',100)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            if(vm.getData.length < 3){
              vm.getData.push(doc.data())
            }
            //console.log('gallery', vm.getData)
          })
      })
      .then(() => {
        this.completedGetData();
      });
    },
    completedGetData(){
      console.log('this.getData', this.getData)
      this.latestList = this.getData;
    },

  }
};
</script>
<style lang="scss" scoped>
  .latest-list{
    .card{
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
