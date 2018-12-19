<template>
  <div class="row text-center latest-list">
    <div class="col-md-4 mb-4">
      <div class="card box-shadow">
        <figure class="card-img-top"  style="background-image: url('http://www.muan.go.kr/www/support/photo_data/www/support/photo_data/ybmodule.file/board/www_photo_data/120x120/1541556920.jpg');"></figure>
        <div class="card-body text-left">
          <p>황토갯벌랜드 전경에 대한 글내용 글입니다.</p>
          <a class="btn btn-secondary btn-sm" href="#" role="button">자세히 보기 »</a>
        </div>
      </div>
    </div><!-- /.col-lg-4 -->
    <div class="col-md-4 mb-4">
      <div class="card box-shadow">
        <figure class="card-img-top"  style="background-image: url('http://www.muan.go.kr/www/support/photo_data/www/support/photo_data/ybmodule.file/board/www_photo_data/120x120/1541556920.jpg');"></figure>
        <div class="card-body text-left">
          <p>무안황토갯벌랜드의 노을빛에 대한 글입니다.</p>
          <a class="btn btn-secondary btn-sm" href="#" role="button">자세히 보기 »</a>
        </div>
      </div>
    </div>
    <div class="col-md-4 mb-4">
      <div class="card box-shadow">
        <figure class="card-img-top"  style="background-image: url('http://www.muan.go.kr/www/support/photo_data/www/support/photo_data/ybmodule.file/board/www_photo_data/120x120/1541556920.jpg');"></figure>
        <div class="card-body text-left">
          <p>갯벌축제 리플릿의 배포는 이곳에서 합니다.</p>
          <a class="btn btn-secondary btn-sm" href="#" role="button">갤러리 메인 »</a>
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
