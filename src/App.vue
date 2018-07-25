<template>
  <div id="app">
    <notifications group="base" />
    <login-modal />
    <ul class="top-bar">
      <li class="header"><h1>{{ header }}</h1></li>
      <li class="login-info"><p v-if="isAuthed">Logged in as {{ username }}</p></li>
      <li class="login-info"><button @click="showLogin" v-if="!isAuthed">Sign In</button></li>
      <li class="login-info"><button class="logout" @click="logout" v-if="isAuthed">Sign out</button></li>
    </ul>

    <section>
      <div>Select a Video</div>
      <v-select
        class="video-picker"
        label="title"
        v-model="currentVideo"
        :options="videoOptions">
      </v-select>
    </section>

    <section>
      <orbit-helper
        :video-code="currentVideo.code"
        :player-vars="{rel: 0}"
        :comments="videoComments"
        :commentNextPageBuffer="2"
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
import {
  demoVideoOptions,
  demoComments
} from './demo/constants'

const noop = (() => {})

export default {
  name: 'orbit-helper-demo',
  components: { OrbitHelper, LoginModal },
  data () {
    return {
      header: 'orbit-helper-demo',
      comments: demoComments,
      noop
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
    }
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
    handleCommentPost ({ time, text }) {
      this.$store.dispatch('comments/post', {
        code: this.currentVideo.code,
        time,
        text
      })
    },
    showLogin () {
      this.$modal.show('login-modal');
    },
    hideLogin () {
      this.$modal.hide('login-modal');
    },
    showRegister () {
      this.$modal.show('register');
    },
    hideRegister () {
      this.$modal.hide('register');
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
  }
}
</script>

<style lang="scss">
html {
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

.video-picker {
  width: 60%;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 10px;
}

.logout-button {
  background-color: gray;
}

.top-bar {
  li > .header { float: left }
  li > .login-info { float: right }
}
</style>
