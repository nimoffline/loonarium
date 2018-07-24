import Vue from 'vue'
import vSelect from 'vue-select'
import VueYouTubeEmbed from 'vue-youtube-embed'
import App from './App.vue'
import store from './store'

Vue.component('v-select', vSelect)
Vue.use(VueYouTubeEmbed)

new Vue({
  el: '#app',
  render: h => h(App),
  store
})
