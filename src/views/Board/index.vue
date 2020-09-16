<template>
  <div class="board">
    <div id="boardCanvas"></div>
  </div>
</template>

<script>
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
      var designer = new window.CanvasDesigner()

      // 引入画板页面及相关函数集js
      designer.widgetHtmlURL = 'https://cdn.webrtc-experiment.com/Canvas-Designer/widget.html'
      designer.widgetJsURL = 'https://cdn.webrtc-experiment.com/Canvas-Designer/widget.js'

      designer.appendTo(document.getElementById('boardCanvas'))

      // 设置开启的功能
      designer.setTools({
        line: true,
        arrow: true,
        pencil: true,
        marker: true,
        dragSingle: true,
        dragMultiple: true,
        eraser: true,
        rectangle: true,
        arc: true,
        bezier: true,
        quadratic: true,
        text: true,
        image: true,
        pdf: true,
        zoom: true,
        lineWidth: true,
        colorsPicker: true,
        extraOptions: true,
        code: true,
        undo: true
      })

      designer.setSelected('pencil')

      // var webrtc =

      // webrtc.onmessage = function (event) {
      //   designer.syncData(event.data)
      // }

      // designer.addSyncListener(function (data) {
      //   webrtc.send(data)
      // })
    }
  }
}
</script>

<style lang="scss" scoped>
.board{

}
</style>
