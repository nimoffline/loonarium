<template>
  <div id="app">
    <notifications group="base" position="top left" />
    <login-modal />
    <register-modal />
    <ul class="top-bar">
      <li><img class="logo" src="https://i.imgur.com/BaN9xkW.png" width="150"/><h1 class="logo-text">{{header}}</h1></li>
      <li class="login-info"><button class="btn" @click="showRegister" v-if="!isAuthed">Register</button></li>
      <li class="login-info"><button class="btn" @click="showLogin" v-if="!isAuthed">Log In</button></li>
      <li class="login-info"><button class="btn logout" @click="logout" v-if="isAuthed">Log out ({{username}})</button></li>
    </ul>
    <section name="subheader" class="subheader-section">
      <p class="subheader italics">
      lu·nar·i·um: a device for illustrating the motion and phases of the moon <sup><a class="black" href="https://www.merriam-webster.com/dictionary/lunarium">[1]</a></sup>
      </p>
      <h3>Time-annotated videos for Orbits to collaborate</h3>
    </section>

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
      <video-comment-player
        :video-code="currentVideo.code"
        :player-vars="{rel: 0}"
        :comments="videoComments"
        :commentNextPageBuffer="10"
        :currentUserId="currentUserId"
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
      Personal
      <a href="https://twitter.com/loonavrs_nim/">Twitter</a>
      &nbsp;|&nbsp;
      <a href="https://github.com/choiryan/loonarium/">Github</a>
      <strong>&nbsp;|&nbsp;</strong>
      Official 
      <a href="https://www.google.com/search?q=loonatheworld.com">loonatheworld</a>
      &nbsp;|&nbsp;
      <a href="https://www.google.com/search?q=dlrowehtanool.com">dlrowehtanool</a>
    </footer>
  </div>
</template>

<script>
import VideoCommentPlayer from '../VideoCommentPlayer/VideoCommentPlayer.vue'
import LoginModal from './components/LoginModal.vue'
import RegisterModal from './components/RegisterModal.vue'
import usernameRegex from './constants/usernameRegex'
import { getQueryParams } from './utils/queryParams'

const noop = (() => {})
const endTagOn = [9, 13, 32, 188]

export default {
  name: 'loonarium',
  components: { VideoCommentPlayer, LoginModal, RegisterModal },
  data () {
    return {
      endTagOn,
      header: 'LOOΠΔrium',
      noop,
      usernameRegex
    }
  },
  computed: {
    isAuthed () {
      return this.$store.getters['auth/isAuthed']
    },
    currentUserId () {
      return this.$store.getters['auth/userId']
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
    handleCommentEdit (data) {
      this.$store.dispatch('comments/edit', data)
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
      this.$modal.show('register-modal')
    },
    showLogin () {
      this.$modal.show('login-modal')
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


footer {
  margin: 10px;
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

.italics {
  font-style: italic;
}

.no-select {
  user-select: none;
}

.subheader {
  margin: 0;
}

.subheader-section {
  margin: 0 12px;
}

.top-bar {
  display: inline-block;
  width: 100%;
  padding: 0;
  margin: 0;
  user-select: none;
  li {
    float: left;
    display: block;
  }
}

.login-info {
  margin-top: 1.2em;
  float: right !important;
}

.logo {
  margin-top: 0.3em;
}

.logo-text {
  margin-top: 0;
}

.video-picker {
  background-color: white;
  border: none !important;
  border-radius: 5px !important;
  display: block;
  min-width: 360px;
  max-width: 700px;
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
