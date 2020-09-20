<template>
  <div class="live">
    <video id="video" controls autoplay></video>
    <!-- <Board></Board> -->
  </div>
</template>

<script>
import io from 'socket.io-client'
import Board from '../Board'
export default {
  components: {
    Board
  },
  data () {
    return {
      socket: '',
      roomId: 1,
      user: 1,
      stream: '',
      iceServers: [{
        urls: [
          'stun:stun.l.google.com:19302',
          'stun:stun1.l.google.com:19302',
          'stun:stun2.l.google.com:19302',
          'stun:stun.l.google.com:19302?transport=udp'
        ]
      }],
      peer: ''
    }
  },
  mounted () {
    this.initSocket()
    this.initWebRTC()
  },
  methods: {
    initWebRTC () {
      var constraints = {
        audio: true,
        video: true
      }
      window.navigator.mediaDevices.getDisplayMedia(constraints)
        .then((stream) => {
          console.log(stream)
          this.stream = stream
          document.getElementById('video').srcObject = stream
          this.peer = initPeer(this.iceServers)
          stream.onended = function () {

          }
        }).catch(function (e) {
          switch (e.name) {
            case 'NotFoundError':
              console.log('没有找到麦克风/摄像头.')
              break
            case 'SecurityError':
            case 'PermissionDeniedError':
              break
            default:
              console.log('打开麦克风/摄像头出错: ' + e.message)
              break
          }
          closeVideoCall(this.peer, document.getElementById('video'))
        })

      const initPeer = function (iceServers) {
        const PeerConnection = window.RTCPeerConnection ||
                         window.mozRTCPeerConnection ||
                         window.webkitRTCPeerConnection
        const peer = new PeerConnection(iceServers)
        // this.peer.onaddstream = function (event) {

        // }
        peer.onicecandidate = (event) => {
          console.log(123)
        }
        peer.onicecandidate = handleICECandidateEvent.bind(this)
        peer.onnegotiationneeded = handleNegotiationNeededEvent.bind(this)

        peer.oniceconnectionstatechange = (evt) => {
          console.log('ICE connection state change: ' + evt.target.iceConnectionState)
          // if (event.candidate) {
          //   this.$socket.emit('__ice_candidate', { candidate: event.candidate, roomid: this.$route.params.roomid, account: v.account })
          // }
        }
        peer.addStream(this.stream)

        function handleICECandidateEvent (event) {
          if (event.candidate) {
            this.sendToServer('iceCandidate', {
              roomId: this.roomId,
              type: 'iceCandidate',
              candidate: event.candidate
            })
          }
        }

        function handleNegotiationNeededEvent () {
          peer.createOffer().then(function (offer) {
            return peer.setLocalDescription(offer)
          })
            .then(function () {
              this.sendToServer('offer', {
                roomId: this.roomId,
                type: 'video-offer',
                sdp: peer.localDescription
              })
            }.bind(this))
            .catch(e => { console.log(e) })
        }
        return peer
      }.bind(this)
      function closeVideoCall (peer, video) {
        if (peer) {
          peer.ontrack = null
          peer.onremovetrack = null
          peer.onremovestream = null
          peer.onicecandidate = null
          peer.oniceconnectionstatechange = null
          peer.onsignalingstatechange = null
          peer.onicegatheringstatechange = null
          peer.onnegotiationneeded = null

          if (video.srcObject) {
            video.srcObject.getTracks().forEach(track => track.stop())
          }

          peer.close()
          peer = null
        }

        video.removeAttribute('src')
        video.removeAttribute('srcObject')
      }
    },
    initSocket () {
      this.socket = io('ws://localhost:3001', {
        reconnectionAttempts: 10
      })
      this.socket.on('answer', res => {
        console.log('answerw', res)
        var desc = new RTCSessionDescription(res.sdp)
        this.peer.setRemoteDescription(desc)
      })
    },
    sendToServer (type, data) {
      console.log(type, data)
      this.socket.emit(type, data)
    }
  }
}

</script>

<style lang="scss" scoped>
  .live {
    height: 100%;

    #video {
      width: 100%;
    }
  }

</style>
