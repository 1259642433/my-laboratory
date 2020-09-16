<template>
    <div class="webrtc">
        <video id="video" controls></video>
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
      var video = document.getElementById('video')
      var constraints = {
        audio: false,
        video: true
      }
      window.navigator.mediaDevices.getDisplayMedia(constraints)
        .then(function (stream) {
          var videoTracks = stream.getVideoTracks()
          console.log('Got stream with constraints:', constraints)
          console.log('Using video device: ' + videoTracks[0].label)
          stream.onended = function () {
            console.log('Stream ended')
          }
          console.log(video)
          video.srcObject = stream
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.webrtc{
    #video{
        width: 100%;
    }
}
</style>
