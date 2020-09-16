<template>
  <div class="app">
    <Header v-if="$route.path!='/login'"></Header>
    <div class="app-container">
          <router-view />
    </div>

  </div>
</template>

<script>
import Header from '@/components/Header'

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
.app {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: rgba(85, 85, 85, 1);
      .app-container {
        flex-grow: 1;
        div{
          height: 100%;
        }
      }
  }

</style>
