<template>
    <div class="choose">
        <button @click="$toPage('/webrtc/live')" type="primary">直播</button>
        <button @click="$toPage('/webrtc/recieve')" type="primary">观看</button>
    </div>
</template>

<script>
export default {
  data () {
    return {

    }
  }
}
</script>

<style lang="scss" scoped>
.choose{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: 50px;
    button{
        margin-top: 20px;
        color: white;
        padding: 10px 20px;
        font-size: 15px;
        background-color: rgb(46, 171, 243);
        border-radius: 5px;
        &:hover{
            background-color: rgb(86, 188, 247);
        }
        &:active{
            background-color: rgba(46, 171, 243,0.8);
        }
    }
}
</style>
