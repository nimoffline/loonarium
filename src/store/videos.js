import Vuex from 'vuex'

const state = () => ({
  comments: [],
  activeVideo: {},
})

const getters = {
  activeVideo (state) {
    return state.activeVideo
  },
  activeVideoId (state) {
    return state.activeVideo ? state.activeVideo.id : null
  },
  activeVideoExists (state) {
    return state.activeVideo && state.activeVideo.id
  }
}

// define the possible mutations that can be applied to our state
const mutations = {
  SET_ACTIVE_VIDEO (state, video={}) {
    state.activeVideo = video
  }
}

const actions = {
  async fetchVideoOptions () {
    console.log('TODO fetch available video options from a backend')
  }
}

export default { state, getters, mutations, actions }
