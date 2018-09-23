import Vue from 'vue'
import Vuex from 'vuex'
import {
  commentDelete,
  commentEdit,
  commentPost,
  fetchVideoCommentsByPage,
  getUrl
} from '../services/api'
import uniq from '../utils/makeUnique'
import linkify from '../utils/linkify'

Vue.use(Vuex)

const state = () => ({
  comments: [],
  paging: {},
  authorsToShow: new Set()
})

const getters = {
  videoComments: (state, getters) => videoId => {
    // 1:00 comment should show up above 0:59 comment
    return state.comments
      .filter(cmt => cmt && cmt.video_code === videoId)
      .filter(cmt => !state.authorsToShow.size || (state.authorsToShow.has(cmt.author_username.toLowerCase())))
  },
  nextPageUrl: state => {
    return state.paging.next
  },
  currentVideoTotalCommentCount: state => {
    return state.paging.count || 0
  },
  authorsToShow: state => {
    return [...state.authorsToShow]
  }
}

// define the possible mutations that can be applied to our state
const mutations = {
  ADD_COMMENT (state, comment) {
    comment.linkifiedText = linkify(comment.text.trim())
    state.paging.count += 1
    state.comments = uniq([...state.comments, comment], 'id').sort(
      (c1, c2) => c2.time === c1.time ? c2.id < c1.id : c1.time - c2.time)
  },
  ADD_COMMENTS (state, comments=[]) {
    comments.map(cmt => {
      cmt.linkifiedText = linkify(cmt.text.trim())
    })
    state.comments = uniq([...state.comments, ...comments], 'id').sort(
      (c1, c2) => c2.time === c1.time ? c2.id < c1.id : c1.time - c2.time)
  },
  EDIT_PAGING (state, paging={}) {
    state.paging = paging
  },
  EDIT_COMMENT (state, newComment={}) {
    newComment.linkifiedText = linkify(newComment.text.trim())
    const [comment] = state.comments.filter(cmt => cmt.id === newComment.id)
    state.comments = [
      ...state.comments.filter(cmt => cmt.id !== newComment.id),
      newComment
    ].sort((c1, c2) => c2.time === c1.time ? c2.id < c1.id : c1.time - c2.time)
  },
  DELETE_COMMENT (state, commentId) {
    state.comments = state.comments.filter(cmt => cmt.id !== commentId)
    state.paging.count -= 1
  },
  SET_AUTHORS_TO_SHOW (state, usernames) {
    if (usernames) {
      const usernamesLower = usernames.map(x => x.toLowerCase())
      state.authorsToShow = new Set([...usernamesLower])
    }
  },
  REMOVE_AUTHOR_TO_SHOW (state, username) {
    state.authorsToShow.delete(username)
  }
}

const actions = {
  async fetchFirstPage ({ commit }, { code, page=1 }) {
    const paging = await fetchVideoCommentsByPage(code, page)
    commit('ADD_COMMENTS', paging.results)
    commit('EDIT_PAGING', paging)
  },
  async fetchNextPage ({ commit, getters, state }) {
    const url = getters['nextPageUrl']
    if (url) {
      const paging = await getUrl(url)
      commit('EDIT_PAGING', paging)
      commit('ADD_COMMENTS', paging.results)
    }
  },
  async post ({ commit, rootDispatch, rootGetters }, { code, time, text, clearTextAreaFn }) {
    if (!code || !text) return
    if (!rootGetters['auth/isAuthed']) {
      Vue.notify({
        group: 'base',
        title: 'You must be logged in to comment',
        type: 'error'
      })
      return
    }
    text = text.trim()

    try {
      const data = await commentPost({ code, time, text })
      commit('ADD_COMMENT', data)
      rootDispatch('videos/addCommentToCurrentVideo')
      Vue.notify({
        group: 'base',
        title: 'Comment Submitted',
        type: 'success'
      })
      clearTextAreaFn()
    } catch (e) {
      if (e && e.response && e.response.status !== 0) {
        Vue.notify({
          group: 'base',
          title: 'Failed to submit comment',
          type: 'error'
        })
      }
    }
  },
  async delete ({ commit }, commentId) {
    try {
      await commentDelete(commentId)
      commit('DELETE_COMMENT', commentId)
      rootDispatch('videos/removeCommentToCurrentVideo')
      Vue.notify({
        group: 'base',
        title: 'Comment Deleted',
        type: 'success'
      })
    } catch (e) {
      if (e && e.response && e.response.status !== 0) {
        Vue.notify({
          group: 'base',
          title: 'Failed to delete comment',
          type: 'error'
        })
      }
    }
  },
  async edit ({ commit }, { comment, onSuccess }) {
    // edit comment (if logged in)
    try {
      const newComment = await commentEdit(comment)
      commit('EDIT_COMMENT', newComment)
      onSuccess()
      Vue.notify({
        group: 'base',
        title: 'Comment Edited',
        type: 'success'
      })
    } catch (e) {
      if (e && e.response && e.response.status !== 0) {
        Vue.notify({
          group: 'base',
          title: 'Failed to edit comment',
          type: 'error'
        })
      }
    }
  }
}

export default { namespaced: true, state, getters, mutations, actions }
