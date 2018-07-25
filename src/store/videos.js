import Vuex from 'vuex'
import { fetchVideos } from '../services/api'
import uniq from '../utils/makeUnique'

const state = () => ({
  currentVideo: {},
  videoOptions: []
})

const getters = {
  currentVideo (state) {
    return state.currentVideo
  },
  currentVideoCode (state) {
    return state.currentVideo ? state.currentVideo.code : null
  },
  currentVideoExists (state) {
    return state.currentVideo && state.currentVideo.id
  },
  videoOptions (state) {
    return state.videoOptions.reverse()
  }
}

// define the possible mutations that can be applied to our state
const mutations = {
  SET_CURRENT_VIDEO (state, video={}) {
    state.currentVideo = video
  },
  SET_VIDEO_OPTIONS (state, videos=[]) {
    state.videoOptions = uniq([
      ...state.videoOptions,
      ...videos
    ], 'code')
  }
}

const actions = {
  async fetchVideoOptions ({ commit }, page=1) {
    const videos = await fetchVideos(page)
    commit('SET_VIDEO_OPTIONS', videos.results)
    if (page === 1) {
      commit('SET_CURRENT_VIDEO', videos.results[videos.results.length-1])
    }
  },
  selectVideo ({ commit, dispatch }, video) {
    if (video && video.code) {
      dispatch('comments/fetchFirstPage', { code: video.code }, { root: true })
      commit('SET_CURRENT_VIDEO', video)
    }
  }
}

export default { namespaced: true, state, getters, mutations, actions }
