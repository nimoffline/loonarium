<template>
  <div id="app">

    <section>
      <h1>{{ header }}</h1>
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
        :video-id="currentVideo.code"
        :player-vars="{rel: 0}"
        :comments="videoComments"
        :commentNextPageBuffer="5"
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
import {
  demoVideoOptions,
  demoComments
} from './demo/constants'
import { 
  mapActions,
  mapGetters,
  mapState
} from 'vuex'

const noop = (() => {})

export default {
  name: 'orbit-helper-demo',
  components: { OrbitHelper },
  data () {
    return {
      header: 'orbit-helper-demo',
      comments: demoComments,
      currentVideo: demoVideoOptions[0],
      videoOptions: demoVideoOptions,
      noop
    }
  },
  computed: {
    videoComments () {
      return this.currentVideo ?
        this.comments.filter(cmt => cmt.videoCode === this.currentVideo.code) : []
    }
  },
  methods: {
    // ...mapActions('comments', ['postComment']),
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
    }
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
  margin-top: 60px;
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
</style>
