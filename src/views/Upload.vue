<template>
  <div class="upload">
    <global-uploader></global-uploader>
  </div>
</template>

<script>
import Upload from '@/components/Upload.vue'
export default {
  name: 'upload',
  components: {
    'global-uploader': Upload
  },
  data () {
    return {

    }
  }
}
</script>

<style lang="scss" scoped>
    .upload{
        width: 1200px;
        margin: 0 auto;
    }
</style>
