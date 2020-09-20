<template>
    <div class="recieve">
        <video id="video" controls autoplay></video>
    </div>
</template>

<script>
import io from 'socket.io-client'
export default {
  data () {
    return {
      stream: '',
      roomId: 1,
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
  },
  methods: {
    initSocket () {
      this.socket = io('ws://localhost:3001', {
        reconnectionAttempts: 10
      })
      this.sendToServer('join', {
        roomId: this.roomId
      })
      this.socket.on('joined', res => {
        console.log(res)
      })

      this.socket.on('getInfo', res => {
        this.getPeerConnection(res, this.peer, this.iceServers)
      })
    },
    getPeerConnection (info, peer, iceServers) {
      const PeerConnection = window.RTCPeerConnection ||
                         window.mozRTCPeerConnection ||
                         window.webkitRTCPeerConnection
      peer = new PeerConnection(iceServers)

      var desc = new RTCSessionDescription(info.sdp)
      peer.setRemoteDescription(desc)
        .then(function () {
          return peer.createAnswer()
        })
        .then(answer => {
          return peer.setLocalDescription(answer)
        })
        .then(() => {
          var msg = {
            roomId: this.roomId,
            type: 'video-answer',
            sdp: peer.localDescription
          }
          this.sendToServer('answer', msg)
        })
      peer.addIceCandidate(info.candidate)
      peer.onaddstream = function (event) {
        document.getElementById('video').srcObject = event.stream
      }
      peer.onicecandidate = (event) => {
        console.log(123)
      }
      peer.onicecandidate = handleICECandidateEvent.bind(this)

      peer.oniceconnectionstatechange = (evt) => {
        console.log('ICE connection state change: ' + evt.target.iceConnectionState)
        if (event.candidate) {
          this.$socket.emit('__ice_candidate', { candidate: event.candidate, roomid: this.$route.params.roomid, account: v.account })
        }
      }

      function handleICECandidateEvent (event) {
        if (event.candidate) {
          this.sendToServer({
            type: 'new-ice-candidate',
            candidate: event.candidate
          })
        }
      }
      // const join = function () {
      //   socket.emit('join', { roomid: this.roomid })
      // }
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
