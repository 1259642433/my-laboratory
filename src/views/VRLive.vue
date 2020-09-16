<template>
  <div class="vrlive">
    <div id="container"></div>
    <!-- <video-player id="video" class="vjs-custom-skin" :options="playerOptions" ref="video">
    </video-player> -->
    <!-- <video src="http://vjs.zencdn.net/v/oceans.mp4" controls></video> -->
  </div>
</template>

<script>
import * as THREE from 'three'
// import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
// import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// custom skin css
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'

// videojs
import videojs from 'video.js'

window.videojs = videojs
// hls plugin for videojs
require('videojs-contrib-hls/dist/videojs-contrib-hls.js')
export default {
  name: 'VRLive',
  data () {
    return {
      camera: null,
      scene: null,
      renderer: null,
      mesh: null,
      video: null,
      playerOptions: {
        playbackRates: [0.7, 1.0, 1.5, 2.0],
        autoplay: true,
        muted: false,
        loop: true,
        preload: 'auto',
        language: 'zh-CN',
        aspectRatio: '16:9',
        fluid: true,
        sources: [{
          withCredentials: false,
          type: 'application/x-mpegURL',
          src: 'http://ivi.bupt.edu.cn/hls/cctv3hd.m3u8'
        }],
        controlBar: {
          timeDivider: false,
          durationDisplay: false
        },
        flash: {
          hls: {
            withCredentials: false
          }
        },
        html5: {
          hls: {
            withCredentials: false
          }
        },
        poster: 'https://images.pexels.com/photos/3518091/pexels-photo-3518091.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
      }
    }
  },
  computed: {
    player () {
      return this.$refs.video.player
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.initScene()
      this.initCamera()
      this.initRenderer()
      this.initContent()
      this.render()
    },
    initScene () {
      this.scene = new THREE.Scene()
    },
    initCamera () {
      this.camera = new THREE.PerspectiveCamera(110, window.innerWidth / window.innerHeight, 1, 1100)
      this.camera.position.set(0, 0, 0)
    },
    initRenderer () {
      const container = document.getElementById('container')
      this.renderer = new THREE.WebGLRenderer()
      this.renderer.setSize(container.offsetWidth, container.offsetHeight)
      container.appendChild(this.renderer.domElement)
    },
    initVideo () {
      this.video = document.createElement('video')
      this.video.controls = true
      this.video.muted = true
      this.video.autoplay = true
      this.video.loop = true
      this.video.crossOrigin = 'Anonymous'
      // http://vfx.mtime.cn/Video/2019/02/04/mp4/190204084208765161.mp4
      this.video.src = 'https://opmmj.oss-cn-beijing.aliyuncs.com/1.mp4'
      this.video.play()
    },
    initContent () {
      this.initVideo()
      // const video = document.getElementById('#video')
      // console.log(video)
      var geometry = new THREE.SphereBufferGeometry(300, 90, 90)
      geometry.scale(-1, 1, 1)
      // console.log(this.player)
      // this.$refs.video.play()
      var texture = new THREE.VideoTexture(this.video)
      texture.minFilter = THREE.LinearFilter
      texture.format = THREE.RGBFormat
      var material = new THREE.MeshBasicMaterial({ map: texture })
      this.mesh = new THREE.Mesh(geometry, material)
      this.mesh.position.set(0, 0, 0)
      this.scene.add(this.mesh)
    },
    render () {
      requestAnimationFrame(this.render)
      this.camera.rotation.y += 0.001
      this.renderer.render(this.scene, this.camera)
    }
  }
}
</script>

<style lang="scss" scoped>
.vrlive{
  flex-grow: 1;
  #container{
    height: 100%;
    line-height: 0;
  }
}
</style>
