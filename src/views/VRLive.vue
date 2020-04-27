<template>
  <div class="vrlive">
    <div id="container"></div>
  </div>
</template>

<script>
import * as THREE from 'three'
// import {OrbitControls} from 'three-orbit-controls';

export default {
  name: 'VRLive',
  data () {
    return {
      camera: null,
      scene: null,
      renderer: null,
      mesh: null
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
      this.initObject()
      this.render()
    },
    initScene () {
      this.scene = new THREE.Scene()
    },
    initCamera () {
      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    },
    initRenderer () {
      const container = document.getElementById('container')
      this.renderer = new THREE.WebGLRenderer()
      this.renderer.setSize(container.offsetWidth, container.offsetHeight)
      container.appendChild(this.renderer.domElement)
    },
    initObject () {
      var geometry = new THREE.SphereGeometry(2.5, 30, 30)
      var material = new THREE.MeshBasicMaterial({ color: 0xB3DD, wireframe: true })
      this.mesh = new THREE.Mesh(geometry, material)
      this.scene.add(this.mesh)
      this.camera.position.z = 5
    },
    render () {
      requestAnimationFrame(this.render)
      this.mesh.rotation.x += 0.005
      this.mesh.rotation.y += 0.001
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
