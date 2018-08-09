import Vue from 'vue'
import 'babel-polyfill'
import InputTag from 'vue-input-tag'
import VModal from 'vue-js-modal'
import Notifications from 'vue-notification'
import vSelect from 'vue-select'
import VueYouTubeEmbed from 'vue-youtube-embed'

import App from './App.vue'
import store from './store'

Vue.component('input-tag', InputTag);
Vue.component('v-select', vSelect)
Vue.use(VueYouTubeEmbed)
Vue.use(VModal, { dialog: true })
Vue.use(Notifications)

new Vue({
  el: '#app',
  render: h => h(App),
  store
})
