<template>
  <div id="app">
    <notifications group="base" />
    <login-modal />
    <register-modal />
    <ul class="top-bar">
      <li class="header"><h1>{{ header }}</h1></li>
      <li class="login-info"><p v-if="isAuthed">Logged in as {{ username }}</p></li>
      <li class="login-info"><button @click="showRegister" v-if="!isAuthed">Register</button></li>
      <li class="login-info"><button @click="showLogin" v-if="!isAuthed">Log In</button></li>
      <li class="login-info"><button class="logout" @click="logout" v-if="isAuthed">Sign out</button></li>
    </ul>
    <p>Annotated videos to help Orbits get started on Loonaverse theorycrafting</p>
    <br/>

    <section class="center-block">
      <span>Select a Video</span>
      <v-select
        class="video-picker"
        label="title"
        v-model="currentVideo"
        :options="videoOptions"
      />
      <input-tag
        :addTagOnKeys="endTagOn"
        class="author-filter"
        placeholder="(Optional) Only show comments from these authors..."
        :tags.sync="authorsToShow"
        :validate="usernameRegex"
      />
    </section>

    <section>
      <orbit-helper
        :video-code="currentVideo.code"
        :player-vars="{rel: 0}"
        :comments="videoComments"
        :commentNextPageBuffer="10"
        :totalCommentCount="currentVideoTotalCommentCount"
        @commentDelete="handleCommentDelete"
        @commentEdit="handleCommentEdit"
        @commentFetchNext="handleCommentFetchNext"
        @commentPost="handleCommentPost"
      />
    </section>

  </div>
</template>

<script>
import OrbitHelper from '../orbithelper/OrbitHelper.vue'
import LoginModal from './components/LoginModal.vue'
import RegisterModal from './components/RegisterModal.vue'
import usernameRegex from './constants/usernameRegex'
import getQueryParams from './utils/queryParams'

const noop = (() => {})
const endTagOn = [9, 13, 32, 188]

export default {
  name: 'orbit-helper-demo',
  components: { OrbitHelper, LoginModal, RegisterModal },
  data () {
    return {
      endTagOn,
      header: 'orbit-helper-demo',
      noop,
      usernameRegex
    }
  },
  computed: {
    isAuthed () {
      return this.$store.getters['auth/isAuthed']
    },
    videoComments () {
      return this.$store.getters['comments/videoComments'](this.currentVideo.code)
    },
    currentVideoTotalCommentCount () {
      return this.$store.getters['comments/currentVideoTotalCommentCount']
    },
    username () {
      return this.$store.getters['auth/username']
    },
    videoOptions () {
      return this.$store.getters['videos/videoOptions']
    },
    currentVideo: {
      get () {
        return this.$store.getters['videos/currentVideo']
      },
      set (vid) {
        this.$store.dispatch('videos/selectVideo', vid)
      }
    },
    authorsToShow: {
      get () {
        return this.$store.getters['comments/authorsToShow']
      },
      set (authors) {
        this.$store.commit('comments/SET_AUTHORS_TO_SHOW', authors)
      }
    },
  },
  methods: {
    handleCommentDelete (commentId) {
      this.$store.dispatch('comments/delete', commentId)
    },
    handleCommentEdit ({ commentId, time, text }) {
      this.$store.dispatch('comments/edit')
    },
    handleCommentFetchNext () {
      this.$store.dispatch('comments/fetchNextPage')
    },
    handleCommentPost ({ time, text, clearTextAreaFn }) {
      this.$store.dispatch('comments/post', {
        code: this.currentVideo.code,
        time,
        text,
        clearTextAreaFn
      })
    },
    showRegister () {
      this.$modal.show('register-modal');
    },
    showLogin () {
      this.$modal.show('login-modal');
    },
    logout () {
      this.$store.dispatch('auth/logout')
      this.$notify({
        group: 'base',
        type: 'success',
        title: 'Logged out'
      });
    }
  },
  created () {
    this.$store.dispatch('auth/onAppStart')
    this.$store.dispatch('videos/fetchVideoOptions')
  },
  mounted () {
    const { authors } = getQueryParams(window.location.search)
    if (authors) {
      const usernamesToShow = authors.split(',')
      this.authorsToShow = usernamesToShow
    }
  }
}
</script>

<style lang="scss">
@import "./assets/normalize.css";
@import "./assets/bootstrap.css";
body {
  background-color: lightgray;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

hr {
  margin-top: 20px;
  margin-bottom: 20px;
}

.video-picker {
  display: block;
  width: 60%;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 10px;
  text-align: left;
  .li {
    margin-bottom: 10px;
  }
}

.dropdown li {
  display: block;
  width: 100%;
  align-items: left;
}

.logout-button {
  background-color: gray;
}

.top-bar {
  li > .header { float: left }
  li > .login-info { float: right }
}

.vue-input-tag-wrapper {
  -webkit-appearance: textfield;
  background-color: white;
  border: none;
  border-radius: 4px;
  cursor: text;
  display: inline-block !important;
  overflow-x: hidden;
  overflow-y: auto;
  padding-left: 4px;
  padding-top: 0px;
  padding-bottom: 0px;
  padding-right: 0px;
  width: 50%;
}

.new-tag {
  width: 100% !important;
  background: transparent;
  border: 0;
  color: #777;
  font-size: 13px;
  margin-bottom: 0px;
  margin-top: 1px;
  outline: none;
  border: none !important;
  padding: 4px;
  padding-left: 0 !important;
}
</style>
