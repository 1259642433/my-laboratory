<template>
  <div id="app">
    <Header v-if="$route.path!='/login'"></Header>
    <router-view />
  </div>
</template>

<script>
import Header from '@/components/Header.vue'

export default {
  name: 'App',
  components: {
    Header
  },
  data () {
    return {

    }
  }
}
</script>
<style lang="scss">
@import "./assets/css/reset.scss";
#app{
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: rgba(85,85,85,1);
}
</style>
