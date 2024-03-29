<template>
  <div id="app" :style="{backgroundPosition: `0 ${starsPosition}px`}">
    <notifications group="base" position="top left" />
    <login-modal />
    <register-modal />
    <header class="logo-text">
      <h1>{{header}}</h1>
      <ul class="top-bar">
        <li v-if="!isAuthed"><button @click="showRegister">Register</button></li>
        <li v-if="!isAuthed"><button @click="showLogin">Log In</button></li>
        <li v-if="isAuthed"><button @click="logout">Log out <p class="logout-username">{{username}}</p></button></li>
      </ul>
    </header>
    <section name="subheader" class="subheader-section">
      <p class="subheader">
      lu·nar·i·um: a device for illustrating the motion and phases of the moon <sup><a class="black" href="https://www.merriam-webster.com/dictionary/lunarium">[1]</a></sup>
      </p>
      <h3>Time-annotated videos for Orbit collaboration</h3>
    </section>
    <section class="center-block">
      <span>Select a Video</span>
      <v-select
        class="video-picker"
        label="title"
        v-model="currentVideo"
        :options="videoOptions"
      >
        <template slot="option" slot-scope="option">
          <!-- Not teaser, notes: 0 -->
          <span v-if="option.title.indexOf('(Notes: 0)') === 0">
            {{ option.title }}
          </span>
          <!-- Not teaser, notes: >0 -->
          <span v-if="option.title.indexOf('(Notes: 0)') === -1" class="bold-title">
            {{ option.title }}
          </span>
         </template>
      </v-select>
    </section>

    <section>
      <video-comment-player
        :video-code="currentVideo.code"
        :player-vars="{rel: 0, color: 'white', fs: 0}"
        :comments="videoComments"
        :commentNextPageBuffer="20"
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
      <a href="https://twitter.com/orrery_nim/">Twitter</a>
      &nbsp;|&nbsp;
      <a href="https://github.com/nimoffline/loonarium/">Github</a>
      <strong>&nbsp;|&nbsp;</strong>
      Official 
      <a href="https://www.google.com/search?q=loonatheworld.com">loonatheworld</a>
      &nbsp;|&nbsp;
      <a href="https://artms-strategy.com/">artms</a>
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
      usernameRegex,
      starsPosition: 0,
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
  mounted () {
    window.addEventListener('scroll', () => {
      this.starsPosition = -(window.scrollY / 3)
    })
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
  background: linear-gradient(#1b2331, #211a26);
}

#app {
  font-family: 'Roboto', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: white;
  background: url('https://i.imgur.com/DT18JOd.png') repeat-x;
}

.vue-dialog {
  color: black;
}


footer {
  margin: 10px;
  a {
    color: #ffb561;
    &:hover {
      color: #ff8722;
    }
  }
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

a {
  color: #2DC896;

  &:hover {
    color: #268178;
  }
}

.bold-title {
  font-weight: bold !important;
}

.btn {
  border: none;
  border-radius: 5px;
  font-size: 16px;
  &:hover {
    background-color: #2DC896 !important;
    color: white;
  }
}

.gray-title {
  color: gray;
}

.italics {
  font-style: italic;
}

.no-select {
  user-select: none;
}

.toggler {
  label {
    cursor: pointer;
  }

  input {
    display: none;

    &:checked + label::before {
      background: #197157;
      border-color: #42c592;
    }
  }

  label::before {
    content: "";
    display: inline-block;
    width: 11px;
    height: 11px;
    border: 1px solid white;
    border-radius: 2px;
    margin-right: 4px;
  }
}

header {
  position: relative;
  background: white;
  padding: 30px 0 15px;
}

header::after {
  content: "";
  display: block;
  position: absolute;
  height: 23px;
  width: 100%;
  bottom: -23px;
  background: url("https://i.imgur.com/WvmhYm9.png") no-repeat center center;
}

header h1 {
  width: 150px;
  height: 85px;
  background: url("https://i.imgur.com/y6sMjD6.png") no-repeat center center;
  background-size: contain;
  font-size: 0;
  margin: 0 auto;
}

.subheader {
  margin: 0;
}

.subheader-section {
  padding: 70px 12px 50px;
  position: relative;

  p {
    opacity: .7;
    margin-bottom: 3px;
  }

  p, h3 {
    font-weight: 300;
  }

  &::after {
    content: "";
    display: block;
    position: absolute;
    left: calc(50% - 3px);
    bottom: -3px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: white;
  }
}

.top-bar {
  display: flex;
  justify-content: center;
  position: absolute;
  align-items: center;
  top: 0;
  right: 0;
  height: 100%;
  padding: 10px 40px 0;
  margin: 0;
  user-select: none;
  text-align: right;

  li {
    margin: 3px;
  }

  button {
    background: transparent;
    padding: 3px 0;
    color: black;
    border: 1px solid #ddd;
    padding: 5px 12px;

    &:hover {
      border-color: #358f8f;
    }
  }
}

#app > .center-block {
  padding: 45px 12px 20px;

  > span {
    display: block;
    font-size: 30px;
    font-weight: 200;
    margin-bottom: 20px;
  }
}

.logo-text {
  margin-top: 0;
}

.logout-username {
  margin: 0;
  color: #25B398;
  display: inline-block;
}

.video-picker {
  border: 2px solid white;
  border-radius: 30px !important;
  display: block;
  min-width: 300px;
  max-width: 700px;
  width: 97%;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 10px;
  text-align: left;
  padding: 5px 10px;
  .li {
    margin-bottom: 10px;
  }
}

.video-picker .dropdown-toggle {
  border: 0;

  .clear {
    margin: 0 8px 1px 0;
    color: white;
  }

  .open-indicator{
    margin: 0 5px 3px 0;
  }
  .open-indicator::before {
    border-color: white;
  }
}

.video-picker .dropdown-menu {
  background: #1d202e;

  li {
    margin: 0;

    a {
      padding: 8px;
      color: white;
    }

    &.active a {
      background: transparent;
      color: #2DC896;
    }

    &.highlight:not(.active) a {
      color: #000;
      background-color: #ff8d39;
    }

    &.highlight.active a {
      background-color: transparent;
    }

    .bold-title {
      font-weight: 300 !important;
    }

    a span:not(.bold-title) {
      opacity: .6;
    }
  }
}

.video-picker .selected-tag {
  color: #fff;
  font-weight: 400;
}

.vue-input-tag-wrapper {
  -webkit-appearance: textfield;
  background: transparent !important;
  border: 1px solid #4c3e51 !important;
  border-radius: 20px !important;
  cursor: text;
  display: inline-block !important;
  min-width: 300px;
  overflow-x: hidden;
  overflow-y: auto;
  padding-left: 5px !important;
  padding-top: 0px;
  padding-bottom: 0px;
  padding-right: 5px !important;
  width: 70%;
  margin: 10px 0 30px !important;

  .input-tag {
    border-radius: 20px !important;
    background: #ff8d39 !important;
    border: 0 !important;
    color: black !important;
    padding: 5px 10px !important;

    .remove {
      color: black !important;
    }
  }
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
  padding-left: 10px !important;
}

@media (max-width: 992px) {
  .container {
    padding: 0;
  }
  .row {
    padding: 0 !important;
    margin: 0 !important;
  }
  .subheader-section {
    padding: 60px 15px 40px;
  }
  #app > .center-block {
    padding: 30px 15px 20px;
  }
  .vue-input-tag-wrapper {
    margin-top: 28px !important;
    width: 88%;
  }
  header {
    padding-bottom: 0;

    .top-bar {
      position: relative;
      flex-direction: row;
      margin-top: 20px;

      li {
        margin: 0 5px;
      }
    }
  }
}
</style>
