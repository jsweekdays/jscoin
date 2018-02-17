import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'

import App from './App'
import BlockChain from './plugins/BlockchainPlugin'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false

Vue.use(BootstrapVue)
Vue.use(BlockChain, {
  peer: {
    key: process.env.PEERJS_KEY,
    trackerUrl: process.env.TRACKER_URL
  }
})

/* eslint-disable no-new */

new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
