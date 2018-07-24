import 'es6-promise/auto'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = () => ({
  currentUser: {}
})

const getters = {
  username (state) {
    return state.currentUser.username
  },
  isAuthed (state) {
    return !!state.currentUser.token
  }
}

// define the possible mutations that can be applied to our state
const mutations = {
  SET_CURRENT_USER: (state, user) => {
    state.currentUser = user
  }
}

const actions = {
  async register ({ commit, dispatch }, { username, password, passwordVerif }) {
    // todo register and retrieve jwt from localstorage
  },
  async login ({ commit, dispatch }, { username, password }) {
    // todo login and retrieve jwt from localstorage
  },
  async logout ({ commit, dispatch }) {
    // todo logout and delete jwt from localstorage
  },
  async changePassword ({ commit, dispatch }, { username, oldPassword, password, passwordVerif }) {
    // todo change password
  },
  async changeUsername ({ commit, dispatch }, { oldUsername, newUsername, password }) {
    // todo change username
  }
}

// create the Vuex instance by combining the state and mutations objects
// then export the Vuex store for use by our components
export default { namespaced: true, state, getters, mutations, actions }