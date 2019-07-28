import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Http from './api/axios'

Vue.config.productionTip = false

// 將封裝好的 axios 掛載到 Vue 實例上全域通用
Vue.prototype.$Http = Http

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
