<template>
    <div class="live">
        <p>弹幕</p>
        <div class="live-container" ref="liveVideo">
            <vue-baberrage :isShow="barrageIsShow" :barrageList="barrageList" :loop="barrageLoop">
            </vue-baberrage>
            <video-player class="vjs-custom-skin" :options="playerOptions">
            </video-player>
        </div>
        <div class="edit">
            <input v-model="msg" type="text" />
            <button @click="addToList(msg)">Send</button>
        </div>
    </div>
</template>

<script>
// custom skin css
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'

// videojs
import videojs from 'video.js'
import {
  vueBaberrage,
  MESSAGE_TYPE
} from 'vue-baberrage'

window.videojs = videojs
// hls plugin for videojs6
require('videojs-contrib-hls/dist/videojs-contrib-hls.js')
export default {
  name: 'live',
  components: {
    vueBaberrage
  },
  data () {
    return {
      danmuList: [],
      msg: 'Hello',
      barrageIsShow: true,
      currentId: 0,
      barrageLoop: false,
      barrageList: [],
      playerOptions: {
        height: '432',
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
  mounted () {
    setInterval(() => {
      this.addToList()
    }, 1000)
  },
  methods: {
    addToList (msg) {
      this.barrageList.push({
        id: ++this.currentId,
        avatar: 'https://images.pexels.com/photos/3518091/pexels-photo-3518091.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
        msg: msg || this.randomMsg(),
        time: 5,
        type: MESSAGE_TYPE.NORMAL
      })
    },
    randomMsg () {
      const msgList = ['你好', '嘻嘻', '哈哈', '2333']
      return msgList[Math.floor(Math.random() * msgList.length)]
    }
  }
}
</script>

<style lang="scss" scoped>
    .live {
        padding: 200px 0;
        p {
            text-align: center;
            margin-bottom: 30px;
            font-size: 28px;
            color: white;
        }

        &-container {
            position: relative;
            margin: 0 auto;
            align-self: flex-start;
            width: 40%;
            border-radius: 5px;
            padding: 10px;
            background-color: rgba(150, 150, 150, 1);
            .baberrage-stage{
                pointer-events: none;
                z-index: 99;
                width: calc(100% - 20px) !important;
                height: calc(100% - 20px);
                .baberrage-item{

                }
            }
        }

        .edit {
            margin: 30px auto;
            display: flex;
            width: 40%;
            border-radius: 5px;
            padding: 15px 10px;
            background-color: rgba(150, 150, 150, 1);

            input {
                width: 100%;
                padding: 0 10px;
                border-bottom: 1px solid rgba(75, 75, 75, 1);
            }

            button {
                margin-left: 10px;
                height: 30px;
                padding: 0 40px;
                color: white;
                border-radius: 5px;
                background-color: rgb(50, 182, 235);
                transition: all .5s;
                &:hover {
                    background-color: rgb(76, 193, 240);
                }
            }
        }
    }
</style>
