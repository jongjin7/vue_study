<template>
  <div class="">
    <ul class="pagination justify-content-end" >
      <li class="page-item" :class="{disabled : pageNum == 0}"><a class="page-link" href="#" @click.stop.prevent="changePageIndex(pageNum)">Previous</a></li>
      <li class="page-item" :class="{active : page == pageNum+1, disabled: page =='...'}" v-for="page in pageItems"><a href="#" class="page-link" @click.stop.prevent="changePageIndex(page)">{{ page }}</a></li>
      <li class="page-item" :class="{disabled : pageNum >= pageCount - 1}"><a class="page-link" href="#" @click.stop.prevent="changePageIndex(pageNum+2)">Next {{ pageNum + 1 }} </a></li>
    </ul>
  </div>
</template>

<script>
    export default {
      name: "BoardCommunityListPaging",
      props:{

        pageSize: {
          type: Number,
          required: false,
          default: 10
        }
      },
      data(){
        return {
          totalListLength : '',
          getOriginData:'',
          pages: [],
          pageItems:[],

          pageNum: 0
        }
      },
      beforeCreate(){
        console.log('paginate beforeCreate');
      },
      created(){
        console.log('paginate created')
        this.getDataToServer();
      },
      mounted(){
        console.log('paginate mounted')

      },
      watch:{
        pages:function(){
          console.log('page변경', this)
        }
      },

      computed:{
        pageCount () {

          let listSize = this.pageSize,
            page = Math.floor(this.totalListLength / listSize);

          if (this.totalListLength % listSize > 0) page += 1;

          /*
          아니면 page = Math.floor((this.totalListLength - 1) / listSize) + 1;
          이런식으로 if 문 없이 고칠 수도 있다!
          */
          return page;
        },


      },
      methods:{
        getDataToServer(){
          const dataCollection = this.$firebaseDB.collection('community').doc('content').collection('community-data');
          dataCollection
            .orderBy('timeStamp')
            .get().then((querySnapshot) => {
            //console.log('querySnapshot',querySnapshot.size)

            this.totalListLength = this.$store.state.communityTotalList = querySnapshot.size;
            let loadData =[];
            let tmpCount = 1;
            let today = new Date();
            let strTodayDate = (today.getFullYear()+'') +
              ((today.getMonth()+1)+'') +
              (today.getDate()+'');
              //console.log('today', strTodayDate)

            querySnapshot.forEach((doc) => {
              let tmp = doc.data();
              tmp.newTimeStamp = this.changeDateFormat(tmp.timeStamp.seconds);
              tmp.latest = (strTodayDate == tmp.newTimeStamp.replace(/\-/g,''))? true : false;
              //console.log('tmp.latest', tmp.latest)
              tmp.listCount = tmpCount++;
              loadData.push(tmp)
            });
            loadData.reverse();
            this.getOriginData = loadData;

            this.paginatedData();
          })
          .catch(function(error) {
            console.log("Error getting document:", error);
          });
        },

        paginatedData (page) {
          const start = this.pageNum * this.pageSize,
            end = start + this.pageSize;

          this.pages = this.getOriginData.slice(start, end);
          this.createPages(page);
          this.changePage(this.pages);
        },

        createPages(page){
          console.log('createPages page', page)
          this.pageItems=[];
          if(page !== undefined){

            for(let i= 0; i<= 6; i++){
              if(i == 5){
                this.pageItems.push('...');
              }else if(i==6){
                this.pageItems.push(this.pageCount)
              }else{
                this.pageItems.push(i+1);
              }

            }
console.log('pgcount', this.pageCount)
            if(page > 4 && page < this.pageCount-3){
              this.pageItems[1]='...';
              this.pageItems[2]= page-1;
              this.pageItems[3]= page;
              this.pageItems[4]= page+1;
            }else if(page > 4 && page >= this.pageCount-3 ){
              this.pageItems[1]='...';
              this.pageItems[2]=this.pageCount-4;
              this.pageItems[3]=this.pageCount-3;
              this.pageItems[4]=this.pageCount-2;
              this.pageItems[5]=this.pageCount-1;
            }
          }else{
            if(this.pageCount < 7) {
              console.log('6개 이하 버튼')
              for(let i= this.pageNum; i< this.pageCount; i++){
                this.pageItems.push(i+1);
              }
            }else{
              console.log('7개 이상 버튼')
              for(let i= 0; i<= 6; i++){
                if(i == 5){
                  this.pageItems.push('...');
                }else if(i==6){
                  this.pageItems.push(this.pageCount)
                }else{
                  this.pageItems.push(i+1);
                }

              }

            }
          }




        },
        changePageIndex(page){
          console.log('changePge', )
          if(page === '...') return;
          console.log('changePge111', page)
          this.pageNum = page-1;
          console.log('page index', 1, page)

          this.paginatedData(page);
        },

        changePage(pageIndex){
          this.$EventBus.$emit('changeList', pageIndex);
        },

        changeDateFormat(date) {
          function unixTime(unixtime) {
            let u = new Date(unixtime*1000);

            return u.getFullYear() +
              '-' + ('0' + (u.getMonth()+1)).slice(-2) +
              '-' + ('0' + u.getDate()).slice(-2) +
              ' ' + ('0' + u.getHours()).slice(-2) +
              ':' + ('0' + u.getMinutes()).slice(-2) +
              ':' + ('0' + u.getSeconds()).slice(-2) +
              '.' + (u.getMilliseconds() / 1000).toFixed(3).slice(2, 5)
          };
          //console.log('변환',unixTime(date))
          return unixTime(date).split(' ')[0];
        },
      }
    }
</script>

<style scoped>
@media (max-width: 767px){
  .pagination{

  }
}
</style>
