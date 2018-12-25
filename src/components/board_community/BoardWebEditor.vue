<template>
  <textarea class="form-control" id="summernote"></textarea>
</template>

<script>

  import $ from "jquery";
  //summer editor
  import "summernote/dist/summernote-bs4.js"

  import "summernote/dist/summernote-bs4.css"
  import "codemirror/lib/codemirror.css";
  //import "codemirror/theme/monokai.css";
  import "codemirror/theme/dracula.css";
  import "codemirror/lib/codemirror.js";
  import "codemirror-formatting/formatting.js";

  export default{
    props : {
      postBody: {
        required: true,
      },
    },
    created(){

    },
    watch: {

    },
    beforeMount(){

    },
    mounted() {
      let vm = this;
      let config = {
        height: 200,
        placeholder: '열심히 글을 작성해보자',
        lang : 'ko-KR',
        fontNames: ['myFonts'],
        fontNamesIgnoreCheck: ['myFonts'],
      };
      config.callbacks = {
        onInit: function () {
          //console.log('editor init', vm.postBody)
          $(vm.$el).summernote("code", vm.postBody);
        },
        onChange: function () {
          vm.$emit('change', $(vm.$el).summernote('code'));
        },
        onBlur: function () {
          //vm.$emit('blur');
        }
      };
      $(this.$el).summernote(config);
    },

    methods:{
      modifyContent(){

      }
    }
  }
</script>
