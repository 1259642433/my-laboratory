<template>
  <div class="imgs">
    <img @click="wave($event)" class="imgs-1" />
    <img class="imgs-2" />
    <img class="imgs-3" />
    <div class="wave" id="wave">
      <div class=" wave5"></div>
      <div class=" wave4"></div>
      <div class=" wave3"></div>
      <div class=" wave2"></div>
      <div class=" wave1"></div>
      <div class=" wave0"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImgAnimation',
  data () {
    return {

    }
  },
  methods: {
    wave (e) {
      const waveDom = document.getElementById('wave')
      waveDom.style.cssText = 'position:absolute;left:' + e.screenX + ';top:' + e.screenY + ';opacity:1'

      this.$forceUpdate()
    }
  }
}

</script>

<style lang="scss" scoped>
  .imgs {
    position: relative;
    width: 100%;
    height: 100vh;

    img {
      display: block;
      width: 100%;
      height: 100%;
      background-attachment: fixed;
      background-size: 100%;
      background-position: center;
    }

    &-1 {
      z-index: 1;
      background-image: url('https://images.pexels.com/photos/4456685/pexels-photo-4456685.jpeg?cs=srgb&dl=pexels-4456685.jpg&fm=jpg');
    }

    &-2 {
      z-index: 2;
      background-image: url('https://images.pexels.com/photos/3791466/pexels-photo-3791466.jpeg?cs=srgb&dl=pexels-3791466.jpg&fm=jpg');
    }

    &-3 {
      z-index: 3;
      background-image: url('https://images.pexels.com/photos/4275561/pexels-photo-4275561.jpeg?cs=srgb&dl=pexels-4275561.jpg&fm=jpg');
    }
  }

  .wave {
    position: absolute;
    top: 0;
    left: 0;
    width: 30px;
    height: 30px;
    border-radius: 300px;
    background: url('https://images.pexels.com/photos/4275561/pexels-photo-4275561.jpeg?cs=srgb&dl=pexels-4275561.jpg&fm=jpg');
    background-attachment: fixed;
    background-position: center center;
  }

  .wave0 {
    z-index: 2;
    background-size: auto 106%;
    -webkit-animation: w 1s forwards;
  }

  .wave1 {
    z-index: 3;
    background-size: auto 102%;
    -webkit-animation: w 1s .2s forwards;
  }

  .wave2 {
    z-index: 4;
    background-size: auto 104%;
    -webkit-animation: w 1s .4s forwards;
  }

  .wave3 {
    z-index: 5;
    background-size: auto 101%;
    -webkit-animation: w 1s .5s forwards;
  }

  .wave4 {
    z-index: 6;
    background-size: auto 102%;
    -webkit-animation: w 1s .8s forwards;
  }

  .wave5 {
    z-index: 7;
    background-size: auto 100%;
    -webkit-animation: w 1s 1s forwards;
  }

  @-webkit-keyframes w {
    0% {
      top: calc((100% - 30px)/2);
      left: calc((100% - 30px)/2);
      width: 30px;
      height: 30px;
    }

    100% {
      top: calc((100% - 300px)/2);
      left: calc((100% - 300px)/2);
      width: 300px;
      height: 300px;
    }
  }

</style>
