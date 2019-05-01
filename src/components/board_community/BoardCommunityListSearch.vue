<template>
  <div class="col-md-8 invisible"><!-- visibility:hidden -->
    <form class="" action="">
      <div class="input-group mb-3">
        <div class="flex-grow-1">
          <label for="bs-search" class="d-none">검색</label>
          <input class="form-control" id="bs-search" type="text" placeholder="검색할 내용">
        </div>
        <div class="input-group-append">
          <button class="btn btn-dark w-100" type="button">검색하기</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
    export default {
        name: "BoardCommunityListSearch"
    }
</script>

<style scoped>

</style>
