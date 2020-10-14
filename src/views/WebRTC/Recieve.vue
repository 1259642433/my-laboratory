<template>
    <div class="recieve">
        <video id="video" preload="auto" autoplay controls></video>
    </div>
</template>

<script>
import io from 'socket.io-client'
export default {
  data () {
    return {
      stream: '',
      roomId: 1,
      userId: '',
      config: {
        iceServers: [{
          urls: 'stun:144.34.165.131:3478'
        }]
      },
      peer: ''
    }
  },
  created () {
    this.userId = Number(Math.random().toString().substr(3, length) + Date.now()).toString(36)
  },
  mounted () {
    this.initSocket()
    this.getPeerConnection()
  },
  methods: {
    initSocket () {
      this.socket = io('wss://www.wangwentehappy.tk:3001', {
        reconnectionAttempts: 10
      })
      this.socket.on('connect', () => {
        this.sendToServer('join', {
          roomId: this.roomId,
          userId: this.userId
        })
      })
      this.socket.on('joined', res => {
        console.log(`用户${res.userId}进入房间，当前房间在线人数${res.roomUserNum}`)
      })
      this.socket.on('offer', res => {
        var desc = new RTCSessionDescription(res)
        this.peer.setRemoteDescription(desc)
          .then(() => {
            return this.peer.createAnswer()
          })
          .then(answer => {
            return this.peer.setLocalDescription(answer)
          })
          .then(() => {
            var msg = {
              roomId: this.roomId,
              userId: this.userId,
              sdp: this.peer.localDescription
            }
            this.sendToServer('answer', msg)
          })
      })
      this.socket.on('iceCandidate', res => {
        var candidate = new RTCIceCandidate(res.candidate)
        console.log(candidate)
        this.peer.addIceCandidate(candidate)
      })
    },
    getPeerConnection () {
      const PeerConnection = window.RTCPeerConnection ||
                        window.mozRTCPeerConnection ||
                        window.webkitRTCPeerConnection
      this.peer = new PeerConnection(this.config)

      this.peer.onaddstream = function (event) {
        const video = document.getElementById('video')
        video.muted = true
        video.srcObject = event.stream
        video.play()
      }

      this.peer.onicecandidate = handleICECandidateEvent.bind(this)

      this.peer.oniceconnectionstatechange = (evt) => {
        console.log('ICE connection state change: ' + evt.target.iceConnectionState)
        // if (event.candidate) {
        //   this.$socket.emit('__ice_candidate', { candidate: event.candidate, roomid: this.$route.params.roomid, account: v.account })
        // }
      }

      function handleICECandidateEvent (event) {
        if (event.candidate) {
          this.sendToServer('iceCandidateFromUser', {
            userId: this.userId,
            roomId: this.roomId,
            candidate: event.candidate
          })
        }
      }

      function closeVideoCall (peer, video) {
        // 关闭peer及释放其他尝试调用过程中已分配的任何资源

        if (peer) {
          peer.ontrack = null
          peer.onremovetrack = null
          peer.onremovestream = null
          peer.onicecandidate = null
          peer.oniceconnectionstatechange = null
          peer.onsignalingstatechange = null
          peer.onicegatheringstatechange = null
          peer.onnegotiationneeded = null

          // if (remoteVideo.srcObject) {
          //   remoteVideo.srcObject.getTracks().forEach(track => track.stop())
          // }

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
    sendToServer (type, data) {
      this.socket.emit(type, data)
    }
  }
}
</script>

<style lang="scss" scoped>
.recieve{
    #video{
        width: 100%;
    }
}
</style>
