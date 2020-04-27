<template>
    <div class="header">
        <div class="nav">
            <router-link to="/live" class="nav-item">
                Live
            </router-link>
            <router-link to="/upload" class="nav-item">
                上传
            </router-link>
            <router-link to="/vrlive" class="nav-item">
                VRLive
            </router-link>
        </div>
    </div>
</template>

<script>
export default {
  name: 'header-component',
  data () {
    return {

    }
  }
}
</script>

<style lang="scss" scoped>
    .header {
        background-color: rgba(75, 75, 75, 1);

        .nav {
            width: 1200px;
            height: 80px;
            margin: 0 auto;
            display: flex;
            justify-content: center;
            align-items: center;

            &-item {
                height: 60px;
                line-height: 60px;
                font-size: 18px;
                color: white;
                padding: 0 20px;
                border-radius: 5px;

                &:hover {
                    background-color: rgba(255, 255, 255, 0.4)
                }
            }
        }
    }
</style>
