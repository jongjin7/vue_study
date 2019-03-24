<template>
  <ul class="contacts">
    <li v-for="user in chatUserList">
      <a href="#" @click.stop.prevent="openChatRoom(user)">
        <div class="img_cont">
          <img :src="user.photoURL" class="rounded-circle user_img">
          <span class="online_icon"></span>
        </div>
        <div class="user_info">
          <span>{{ user.displayName }}</span>
        </div>
      </a>
      <div class="checkInvite">
        <input type="checkbox" name="">
      </div>
    </li>
  </ul>
</template>

<script>
  export default{
    name:'ChatUserList',
    props:[
      'chatUserList'
    ],
  }
</script>
<style scoped>
  .contacts{
    display: block;
    list-style: none;
    padding: 0;
    margin-bottom: 0;
  }
  .contacts li{
    display: inline-block;
    padding: 5px 10px;
    vertical-align: middle;
    text-align: center;
  }

  .contacts li a{
    text-decoration: none;
  }

  .user_img{
    height: 70px;
    width: 70px;
    border:1.5px solid #f5f6fa;

  }
  .user_img_msg{
    height: 40px;
    width: 40px;
    border:1.5px solid #f5f6fa;

  }
  .img_cont{
    display: block;
    position: relative;
    height: 70px;
    width: 70px;
    margin:0 auto;
  }
  .img_cont_msg{
    height: 40px;
    width: 40px;
  }
  .online_icon{
    position: absolute;
    height: 15px;
    width:15px;
    background-color: #4cd137;
    border-radius: 50%;
    bottom: 0.2em;
    right: 0.4em;
    border:1.5px solid white;
  }
  .offline{
    background-color: #c23616 !important;
  }
  .user_info{
    display: block;
    padding:0 0.25rem;
    margin-top: auto;
    margin-bottom: auto;
    line-height:1.3;
    text-decoration:none;
  }
  .user_info span{
    font-size: 0.75rem;
  }
  .user_info p{
    margin-bottom: 0;
    font-size: 0.5rem;
    color:#999;
  }
  .contacts li a{
    text-decoration: none;
    color: #444;
  }
  .contacts li a:hover{
    color:#007bff;
    font-weight: bold;
  }
  .contacts li a:hover .user_img{
    border-color:#007bff;
  }

</style>
