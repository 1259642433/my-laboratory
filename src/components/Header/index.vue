<template>
  <div class="header">
    <div class="nav">
      <router-link to="/live" class="nav-item">
        Live
      </router-link>
      <router-link to="/upload" class="nav-item">
        上传
      </router-link>
      <router-link to="/vrlive" class="nav-item">
        VRLive
      </router-link>
      <router-link to="/imgscroll" class="nav-item">
        图片滚动覆盖
      </router-link>
      <router-link to="/board" class="nav-item">
        白板
      </router-link>
      <router-link to="/webrtc" class="nav-item">
        WebRtc(1对多)
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'header-component',
  data () {
    return {

    }
  }
}

</script>

<style lang="scss" scoped>
  .header {
    background-color: rgba(75, 75, 75, 1);

    .nav {
      height: 80px;
      margin: 0 auto;
      display: flex;
      justify-content: center;
      align-items: center;

      &-item {
        height: 60px;
        line-height: 60px;
        font-size: 18px;
        color: white;
        padding: 0 20px;
        border-radius: 5px;

        &:hover {
          background-color: rgba(255, 255, 255, 0.4)
        }
      }
    }
  }

</style>
