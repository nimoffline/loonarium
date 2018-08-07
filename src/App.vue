<template>
  <div id="app">
    <notifications group="base" position="top left" />
    <login-modal />
    <register-modal />
    <ul class="top-bar">
      <li><h1>{{ header }}</h1></li>
      <li class="login-info"><button class="btn" @click="showRegister" v-if="!isAuthed">Register</button></li>
      <li class="login-info"><button class="btn" @click="showLogin" v-if="!isAuthed">Log In</button></li>
      <li class="login-info"><button class="btn logout" @click="logout" v-if="isAuthed">Log out ({{username}})</button></li>
    </ul>
    <h3 class="subheader">Annotated videos for Loonaverse deep dives</h3>
    <hr/>
    <section class="center-block">
      <span>Select a Video</span>
      <v-select
        class="video-picker"
        label="title"
        v-model="currentVideo"
        :options="videoOptions"
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
    <section class="section-bottom" id="optional-settings">
      <input-tag
        :addTagOnKeys="endTagOn"
        class="author-filter"
        placeholder="(Optional) Only show comments from these authors..."
        :tags.sync="authorsToShow"
        :validate="usernameRegex"
      />
    </section>
    <footer id="footer">
      <a href="https://github.com/choiryan/orbithelper">Github</a>
      &nbsp;|&nbsp;
      <a href="https://loonaverse.github.io/">loonaverse.github.io</a>
      &nbsp;|&nbsp;
      <a href="https://www.google.com/search?q=loonatheworld.com">loonatheworld</a>
      &nbsp;|&nbsp;
      <a href="https://www.google.com/search?q=dlrowehtanool.com">dlrowehtanool</a>
    </footer>
  </div>
</template>

<script>
import OrbitHelper from '../orbithelper/OrbitHelper.vue'
import LoginModal from './components/LoginModal.vue'
import RegisterModal from './components/RegisterModal.vue'
import usernameRegex from './constants/usernameRegex'
import { getQueryParams } from './utils/queryParams'

const noop = (() => {})
const endTagOn = [9, 13, 32, 188]

export default {
  name: 'orbit-helper-demo',
  components: { OrbitHelper, LoginModal, RegisterModal },
  data () {
    return {
      endTagOn,
      header: 'orbit-helper',
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
    const { authors, v } = getQueryParams()
    if (authors) {
      const usernamesToShow = authors.split(',')
      this.authorsToShow = usernamesToShow
    }
    this.$store.dispatch('auth/onAppStart')
    this.$store.dispatch('videos/fetchVideoOptions', { preselect: +v })
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

a {
  color: #42b983;
}

footer {
  margin-top: 10px;
}

h1 {
  font-weight: normal;
  font-size: 1.8em;
  margin-left: 0.2em;
  margin-top: 0.6em;
}

h3 {
  font-weight: normal;
  padding: 0;
  margin: 0;
}

hr {
  margin-top: 20px;
  margin-bottom: 20px;
}

li {
  display: block;
  margin: 0 10px;
}

ul {
  list-style-type: none;
  -webkit-margin-before: 0;
          margin-before: 0;
  -webkit-padding-start: 0;
          padding-start: 0;
}

.btn {
  border: none;
  border-radius: 5px;
  font-size: 16px;
  &:hover {
    background-color: #cde69c !important;
  }
}

.top-bar {
  display: inline-block;
  width: 100%;
  padding: 0;
  margin: 0;
  li {
    float: left;
    display: block;
  }
}

.login-info {
  margin-top: 1.2em;
  float: right !important;
}

.video-picker {
  background-color: white;
  border: none !important;
  border-radius: 5px !important;
  display: block;
  min-width: 360px;
  width: 70%;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 10px;
  text-align: left;
  .li {
    margin-bottom: 10px;
  }
}

.vue-input-tag-wrapper {
  -webkit-appearance: textfield;
  background-color: white;
  border: none !important;
  border-radius: 5px !important;
  cursor: text;
  display: inline-block !important;
  min-width: 360px;
  overflow-x: hidden;
  overflow-y: auto;
  padding-left: 4px;
  padding-top: 0px;
  padding-bottom: 0px;
  padding-right: 0px;
  width: 70%;
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
