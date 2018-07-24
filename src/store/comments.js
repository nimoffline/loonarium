import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = () => ({
  comments: [],
  pagings: {},
})

const getters = {
  videoComments: (state, getters) => (videoId) => {
    // 1:00 comment should show up above 0:59 comment
    return state.comments
      .filter(cmt => cmt && cmt.videoId === videoId)
      .sort((c1, c2) => c1.timeStart > c2.timeStart)
  }
}

// define the possible mutations that can be applied to our state
const mutations = {
  ADD_COMMENT (state, comment) {
    state.comments = [...state.comments, comment]
  },
  ADD_COMMENTS (state, comments=[]) {
    state.comments = [...state.comments, ...comments]
  },
  EDIT_COMMENT (state, commentId, message) {
    [comment] = state.comments.filter(cmt => cmt.id === commentId)
    if (comment) comment.message = message
    state.comments = [...state.comments, comment]
  },
  DELETE_COMMENT (state, commentId) {
    state.comments = state.comments.filter(cmt => cmt.id !== commentId)
  }
}

const actions = {
  async fetchNextPage ({ commit }, { videoId, page }) {
    // todo fetch comments for one videoId, via page
  },
  async delete ({ commit }, commentId) {
    // delete comment user owns
  },
  async post ({ commit, rootGetters }, { code, time, text }) {
    console.log('TODO post comment to db', code, time, text)
    // TODO replace example with actual db call - try t2.nano+NodeJS+sqlite? 
    commit('ADD_COMMENT', {
      author: '_anonymous',
      timeStart: time,
      id: Math.random() * 1000000,
      text: text,
      videoCode: code
    })
    // post comment (if logged in)
  },
  async edit ({ commit }, { commentId, time, text }) {
    // edit comment (if logged in)
  }
}

export default { namespaced: true, state, getters, mutations, actions }
