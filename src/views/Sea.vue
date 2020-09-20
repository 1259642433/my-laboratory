<template>
  <div class="sea">
    <div id="seaBackground"></div>
  </div>
</template>

<script>
import {
  vertex,
  fragment
} from '@a/js/shader/sea'
import * as THREE from 'three'
export default {
  data () {
    return {

    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      var el = document.getElementById('seaBackground')
      var renderer, camera, scene, clock
      // 传递给着色器的uniform参数
      var uniforms = {
        iTime: {
          value: 1.0
        },
        iResolution: {
          value: new THREE.Vector2(el.clientWidth * 1.0, el.clientHeight * 1.0)
        },
        iMouse: {
          value: new THREE.Vector2(0.0, 0.0)
        }
      }

      scene = new THREE.Scene()
      scene.add(initCamera(el))
      scene.add(initMesh(el))
      el.appendChild(initRender(el))
      clock = new THREE.Clock()
      animate()

      var mouseStartPosition = null // 鼠标起始位置
      window.addEventListener('mousemove', function (event) {
        if (!mouseStartPosition) {
          mouseStartPosition = {
            x: event.clientX,
            y: event.clientY
          }
        } else {
          uniforms.iMouse.value.x = event.clientX - mouseStartPosition.x
          uniforms.iMouse.value.y = event.clientY - mouseStartPosition.y
        }
      })

      window.addEventListener('resize', function () {
        onResize(el)
      })

      function initCamera (el) {
        camera = new THREE.PerspectiveCamera(45, el.clientWidth / el.clientHeight, 1, 2000)
        camera.position.set(0, 0, 360)
        return camera
      }

      function initMesh (el) {
        var material = new THREE.ShaderMaterial({
          uniforms: uniforms,
          vertexShader: vertex,
          fragmentShader: fragment
        })
        var geom = new THREE.PlaneBufferGeometry(el.clientWidth, el.clientHeight)
        var mesh = new THREE.Mesh(geom, material)
        return mesh
      }

      function initRender (el) {
        renderer = new THREE.WebGLRenderer({
          antialias: true
        })

        renderer.setSize(el.clientWidth, el.clientHeight)

        return renderer.domElement
      }

      function animate () {
        requestAnimationFrame(animate)
        var delta = clock.getDelta() // 获取本次和上次的时间间隔
        uniforms.iTime.value += delta // 设置着色器使用的 iTime 参数
        renderer.render(scene, camera) // 重新渲染
      }

      function onResize (el) {
        camera.aspect = el.clientWidth / el.clientHeight
        camera.updateProjectionMatrix()
        renderer.setSize(el.clientWidth, el.clientHeight)
      }
    }
  }
}

</script>

<style lang="scss" scoped>
.sea{
  height: 100%;
  overflow: hidden;
  ::v-deep #seaBackground{
    height: 100%;
    canvas{
          display: block;
    }
  }
}
</style>
