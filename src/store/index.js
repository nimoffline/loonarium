import Vue from 'vue'
import Vuex from 'vuex'

// import Vuex modules
import auth from './auth'
import comments from './comments'
import videos from './videos'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    auth,
    comments,
    videos,
  }
})

export default store
