<template>
  <div class="live">
    <!-- <video id="video" controls autoplay></video> -->
    <Board></Board>
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
      config: {
        iceServers: [{
          urls: 'stun:144.34.165.131:3478'
        }]
      },
      peerList: {}
    }
  },
  mounted () {
    this.initSocket()
    this.getStream()

    // this.initWebRTC()
  },
  methods: {
    getStream () {
      var constraints = {
        audio: true,
        video: true
      }
      window.navigator.mediaDevices.getDisplayMedia(constraints)
        .then((stream) => {
          this.stream = stream
          // document.getElementById('video').srcObject = stream
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
          this.closeVideoCall(this.peer, document.getElementById('video'))
        })
    },
    createPeer (res) {
      const PeerConnection = window.RTCPeerConnection ||
                        window.mozRTCPeerConnection ||
                        window.webkitRTCPeerConnection
      const peer = new PeerConnection(this.config)

      // this.peer.onaddstream = function (event) {

      // }

      peer.onicecandidate = handleICECandidateEvent.bind(this)
      peer.onnegotiationneeded = handleNegotiationNeededEvent.bind(this)

      peer.oniceconnectionstatechange = (event) => {
        console.log('ICE connection state change: ', event)
        this.text += `<p>ICE connection state change: ${event.target.iceConnectionState}</p>`
        // if (event.candidate) {
        //   this.$socket.emit('__ice_candidate', { candidate: event.candidate, roomid: this.$route.params.roomid, account: v.account })
        // }
      }

      peer.addStream(this.stream)

      function handleICECandidateEvent (event) {
        if (event.candidate) {
          this.sendToServer('iceCandidate', {
            userId: res.userId,
            roomId: this.roomId,
            candidate: event.candidate
          })
        }
      }

      function handleNegotiationNeededEvent () {
        peer.createOffer().then(function (offer) {
          return peer.setLocalDescription(offer)
        })
          .then(() => {
            this.sendToServer('offer', {
              userId: res.userId,
              roomId: this.roomId,
              sdp: peer.localDescription
            })
          })
          .catch(e => { console.log(e) })
      }
      return peer
    },
    initSocket () {
      this.socket = io('wss://www.ashenone.tk:3001', {
        reconnectionAttempts: 10
      })
      this.socket.on('connect', res => {
        console.log('连接成功')
        this.sendToServer('openRoom', {
          roomId: this.roomId
        })
      })
      this.socket.on('disconnect', res => {
        console.log('断开连接')
      })
      this.socket.on('joined', res => {
        console.log(`用户${res.userId}进入房间，当前房间在线人数${res.roomUserNum}`)
      })
      this.socket.on('call', res => {
        const peer = this.createPeer(res)
        this.peerList[res.userId] = {
          socketInfo: res,
          peer: peer
        }
      })
      this.socket.on('answer', res => {
        var desc = new RTCSessionDescription(res.sdp)
        this.peerList[res.userId].peer.setRemoteDescription(desc)
      })
      this.socket.on('iceCandidateFromUser', res => {
        var candidate = new RTCIceCandidate(res.candidate)
        console.log(candidate)
        this.peerList[res.userId].peer.addIceCandidate(candidate)
      })
    },
    sendToServer (type, data) {
      // console.log(type, data)
      this.socket.emit(type, data)
    },
    closeVideoCall (peer, video) {
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
  }
}

</script>

<style lang="scss" scoped>
  .live {
    height: 100%;

    #video {
      width: 100%;
      background-color: white;
    }
  }

</style>
