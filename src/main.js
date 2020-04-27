import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/utils/introduce' //

Vue.config.productionTip = false

Vue.prototype.$toPage = function (url) {
  this.$router.push(url)
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
