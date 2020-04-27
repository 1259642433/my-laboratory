<template>
    <div id="global-uploader">

        <!-- 上传 -->
        <uploader ref="uploader" :options="options" :autoStart="false" @file-added="onFileAdded"
            @file-success="onFileSuccess" @file-progress="onFileProgress" @file-error="onFileError"
            class="uploader-app">
            <uploader-unsupport></uploader-unsupport>

            <uploader-btn id="global-uploader-btn" :attrs="attrs" ref="uploadBtn">选择文件</uploader-btn>

            <uploader-list v-show="panelShow">
                <div class="file-panel" slot-scope="props" :class="{'collapse': collapse}">
                    <div class="file-title">
                        <h2>文件列表</h2>
                        <div class="operate">
                            <button @click="fileListShow" type="text" :title="collapse ? '展开':'折叠' ">
                                <i class="iconfont" :class="collapse ? 'icon-fullscreen': 'icon-minus-round'"></i>
                            </button>
                            <button @click="close" type="text" title="关闭">
                                <i class="iconfont icon-close"></i>
                            </button>
                        </div>
                    </div>

                    <ul class="file-list">
                        <li v-for="file in props.fileList" :key="file.id">
                            <uploader-file :class="'file_' + file.id" ref="files" :file="file" :list="true">
                            </uploader-file>
                        </li>
                        <div class="no-file" v-if="!props.fileList.length">
                            <i class="nucfont inuc-empty-file"></i>
                            暂无待上传文件
                        </div>
                    </ul>
                </div>
            </uploader-list>

        </uploader>

    </div>
</template>

<script>
import SparkMD5 from 'spark-md5'
export default {
  name: 'upload-component',
  props: [

  ],
  data () {
    return {
      options: {
        target: 'http://jygprod.xshaitt.com/api/v1/uploads', // 目标上传 URL
        chunkSize: '2048000', // 分块大小
        fileParameterName: 'file', // 上传文件时文件的参数名，默认file
        maxChunkRetries: 3, // 最大自动失败重试上传次数
        testChunks: true, // 是否开启服务器分片校验
        // 服务器分片校验函数，秒传及断点续传基础
        checkChunkUploadedByResponse: function (chunk, message) {
          const objMessage = JSON.parse(message)
          if (objMessage.skipUpload) {
            return true
          }
          return (objMessage.uploaded || []).indexOf(chunk.offset + 1) >= 0
        }
        // headers: {
        //     // 在header中添加的验证，请根据实际业务来
        //     Authorization: "Bearer " + Ticket.get().access_token
        // },
      },
      attrs: {
        // 接受的文件类型，形如['.png', '.jpg', '.jpeg', '.gif', '.bmp'...] 这里我封装了一下
        accept: ['.png', '.jpg', '.jpeg', '.gif', '.bmp']
      },
      panelShow: false, // 选择文件后，展示上传panel
      collapse: 6,
      fileListShow: true
    }
  },
  methods: {
    onFileAdded (file) {
      this.panelShow = true

      // 计算MD5，下文会提到
      this.computeMD5(file)
    },

    onFileProgress (rootFile, file, chunk) {
      console.log(`上传中 ${file.name}，chunk：${chunk.startByte / 1024 / 1024} ~ ${chunk.endByte / 1024 / 1024}`)
    },
    onFileSuccess (rootFile, file, response, chunk) {
      const res = JSON.parse(response)

      // 服务器自定义的错误，这种错误是Uploader无法拦截的
      if (!res.result) {
        this.$message({
          message: res.message,
          type: 'error'
        })
        return
      }

      // 如果服务端返回需要合并
      if (res.needMerge) {
        this.axios.mergeSimpleUpload({
          tempName: res.tempName,
          fileName: file.name,
          ...this.params
        }).then(data => {
          // 文件合并成功
          this.$emit('fileSuccess', data)
        }).catch(e => {})
      } else { // 不需要合并
        this.$emit('fileSuccess', res)
        console.log('上传成功')
      }
    },

    onFileError (rootFile, file, response, chunk) {
      console.log(response)
    },
    close () {

    },
    computeMD5 (file) {
      const fileReader = new FileReader()
      const time = new Date().getTime()
      const blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice
      let currentChunk = 0
      const chunkSize = 10 * 1024 * 1000
      const chunks = Math.ceil(file.size / chunkSize)
      const spark = new SparkMD5.ArrayBuffer()

      // 文件状态设为"计算MD5"
      // this.statusSet(file.id, 'md5');

      file.pause()

      loadNext()

      fileReader.onload = e => {
        spark.append(e.target.result)
        if (currentChunk < chunks) {
          currentChunk++
          loadNext()
          // 实时展示MD5的计算进度
          this.$nextTick(() => {
            console.log('校验MD5 ' + ((currentChunk / chunks) * 100)
              .toFixed(0) + '%')
          })
        } else {
          const md5 = spark.end()
          this.computeMD5Success(md5, file)
          console.log(
                            `MD5计算完毕：${file.name} \nMD5：${md5} \n分片：${chunks} 大小:${file.size} 用时：${new Date().getTime() - time} ms`
          )
        }
      }
      fileReader.onerror = function () {
        this.error(`文件${file.name}读取出错，请检查该文件`)
        file.cancel()
      }

      function loadNext () {
        const start = currentChunk * chunkSize
        const end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize
        fileReader.readAsArrayBuffer(blobSlice.call(file.file, start, end))
      }
    },

    computeMD5Success (md5, file) {
      // 将自定义参数直接加载uploader实例的opts上
      Object.assign(this.uploader.opts, {
        query: {
          ...this.params
        }
      })
      file.uniqueIdentifier = md5
      file.resume()
      this.statusRemove(file.id)
    }
    // /**
    //  * 新增的自定义的状态: 'md5'、'transcoding'、'failed'
    //  * @param id
    //  * @param status
    //  */
    // statusSet(id, status) {
    //     let statusMap = {
    //         md5: {
    //             text: '校验MD5',
    //             bgc: '#fff'
    //         },
    //         merging: {
    //             text: '合并中',
    //             bgc: '#e2eeff'
    //         },
    //         transcoding: {
    //             text: '转码中',
    //             bgc: '#e2eeff'
    //         },
    //         failed: {
    //             text: '上传失败',
    //             bgc: '#e2eeff'
    //         }
    //     }
    //     this.$nextTick(() => {
    //         $(`<p class="myStatus_${id}"></p>`).appendTo(`.file_${id} .uploader-file-status`).css({
    //             'position': 'absolute',
    //             'top': '0',
    //             'left': '0',
    //             'right': '0',
    //             'bottom': '0',
    //             'zIndex': '1',
    //             'backgroundColor': statusMap[status].bgc
    //         }).text(statusMap[status].text);
    //     })
    // },
    // statusRemove(id) {
    //     this.$nextTick(() => {
    //         $(`.myStatus_${id}`).remove();
    //     })
    // },
    // error(msg) {
    //     this.$notify({
    //         title: '错误',
    //         message: msg,
    //         type: 'error',
    //         duration: 2000
    //     })
    // }
  }
}
</script>

<style lang="scss" scoped>
    // #global-uploader {
    //     position: fixed;
    //     z-index: 20;
    //     right: 15px;
    //     bottom: 15px;
    //     .uploader-app {
    //         width: 520px;
    //     }
    //     .file-panel {
    //         background-color: #fff;
    //         border: 1px solid #e2e2e2;
    //         border-radius: 7px 7px 0 0;
    //         box-shadow: 0 0 10px rgba(0, 0, 0, .2);
    //         .file-title {
    //             display: flex;
    //             height: 40px;
    //             line-height: 40px;
    //             padding: 0 15px;
    //             border-bottom: 1px solid #ddd;
    //             .operate {
    //                 flex: 1;
    //                 text-align: right;
    //             }
    //         }
    //         .file-list {
    //             position: relative;
    //             height: 240px;
    //             overflow-x: hidden;
    //             overflow-y: auto;
    //             background-color: #fff;
    //             > li {
    //                 background-color: #fff;
    //             }
    //         }
    //         &.collapse {
    //             .file-title {
    //                 background-color: #E7ECF2;
    //             }
    //         }
    //     }
    //     .no-file {
    //         position: absolute;
    //         top: 50%;
    //         left: 50%;
    //         transform: translate(-50%, -50%);
    //         font-size: 16px;
    //     }
    //     // ::v-deep .uploader-file-icon {
    //     //     &:before {
    //     //         content: '' !important;
    //     //     }
    //     //     &[icon=image] {
    //     //         background: url(./images/image-icon.png);
    //     //     }
    //     //     &[icon=video] {
    //     //         background: url(./images/video-icon.png);
    //     //     }
    //     //     &[icon=document] {
    //     //         background: url(./images/text-icon.png);
    //     //     }
    //     // }
    //     // ::v-deep .uploader-file-actions > span {
    //     //     margin-right: 6px;
    //     // }
    // }
    /* 隐藏上传按钮 */
    // #global-uploader-btn {
    //     position: absolute;
    //     clip: rect(0, 0, 0, 0);
    // }
</style>
