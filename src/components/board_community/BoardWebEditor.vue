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
      model: {
        required: true
      },
      height: {
        type: String,
        default: '150'
      }
    },
    created(){

    },
    mounted() {
      let config = {
        height: this.height
      };
      let vm = this;
      config.callbacks = {
        onInit: function () {
          $(vm.$el).summernote("code", vm.model);
        },
        onChange: function () {
          vm.$emit('update:model', $(vm.$el).summernote('code'));
        },
      };

      console.log('editor', this.$el);
      $(this.$el).summernote(config);
    },
    methods:{

    }
  }
</script>
