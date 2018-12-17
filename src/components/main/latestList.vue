<template>
  <div class="row text-center latest-list">
    <div class="col-md-4 mb-4">
      <div class="card box-shadow">
        <img class="card-img-top" src="http://www.muan.go.kr/www/support/photo_data/www/support/photo_data/ybmodule.file/board/www_photo_data/120x120/1541556920.jpg" alt="Generic placeholder image">
        <div class="card-body">
          <p>황토갯벌랜드 전경에 대한 글내용 글입니다.</p>
          <p><a class="btn btn-secondary" href="#" role="button">상세보기 »</a></p>
        </div>
      </div>
    </div><!-- /.col-lg-4 -->
    <div class="col-md-4 mb-4">
      <div class="card box-shadow">
        <img class="card-img-top" src="http://www.muan.go.kr/www/support/photo_data/ybmodule.file/board/www_photo_data/120x120/1536567628.jpg" alt="Generic placeholder image">
        <div class="card-body">
          <p>무안황토갯벌랜드의 노을빛에 대한 글입니다.</p>
          <p><a class="btn btn-secondary" href="#" role="button">상세보기 »</a></p>
        </div>
      </div>
    </div>
    <div class="col-md-4 mb-4">
      <div class="card box-shadow">
        <img class="card-img-top" src="http://www.muan.go.kr/www/support/photo_data/ybmodule.file/board/www_photo_data/120x120/1536124215.jpg" alt="Generic placeholder image">
        <div class="card-body">
          <p>갯벌축제 리플릿의 배포는 이곳에서 합니다.</p>
          <p><a class="btn btn-secondary" href="#" role="button">상세보기 »</a></p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "latestList",
  data() {
    return {};
  }
};
</script>
<style lang="scss" scoped>
  .latest-list{
    .card{
      img{
        width:100%; height:auto;
      }
    }
    @media (max-width:767px) {
      .card{
        flex-direction:row;
        align-content: stretch;

        img{
          width:50%;
          border-radius:0.2rem;
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
        }
        .card-body{
          width:50%;
        }
      }

    }
  }
</style>
