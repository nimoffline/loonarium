import Vue from 'vue'
import VModal from 'vue-js-modal'
import Notifications from 'vue-notification'
import vSelect from 'vue-select'
import VueYouTubeEmbed from 'vue-youtube-embed'

import App from './App.vue'
import store from './store'

Vue.component('v-select', vSelect)
Vue.use(VueYouTubeEmbed)
Vue.use(VModal)
Vue.use(Notifications)

new Vue({
  el: '#app',
  render: h => h(App),
  store
})
