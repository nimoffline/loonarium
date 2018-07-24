<template>
<div class="orbit-helper" :style="elementStyle">
  <youtube
    :video-id="videoId"
    :player-vars="playerVars"
    @ended="playerEnded"
    @paused="playerPaused"
    @playing="playerPlaying"
    @ready="playerReady"
  >
  </youtube>
  <ul>
    <label class="toggler">
      <input
        v-model="shouldPauseOnNewComment"
        type="checkbox"/>
        Pause on next comment
    </label>
    <label class="toggler">
      <input
        v-model="shouldShowComposer"
        type="checkbox"/>
        Show comment composer
    </label>
  </ul>
  <comment-composer
    v-show="shouldShowComposer"
    :elapsedSeconds="time"
    @post="commentPost"
  />
  <hr/>
  <comment-list
    :comments="comments"
    :elapsedSeconds="time"
    :onShowNewComment="newCommentPauseFn"
    :style="commentListStyle"
    @commentFetchNext="commentFetchNext"
    @commentEdit="commentEdit"
    @commentDelete="commentDelete"
  />
</div>
</template>

<script>
import CommentComposer from './CommentComposer.vue'
import CommentList from './Comments.vue'
import {
  UPDATE_INTERVAL_PAUSED,
  UPDATE_INTERVAL_PLAYING
} from './constants/numbers'
const noop = (() => {})

export default {
  name: 'orbit-helper',
  components: { CommentComposer, CommentList },
  props: {
    commentNextPageBuffer: {
      type: Number,
      default: 5
    },
    comments: {
      type: Array,
      default () {
        return []
      }
    },
    commentListStyle: {
      type: Object,
      default () {
        return {}
      }
    },
    elementStyle: {
      type: Object,
      default () {
        return {}
      }
    },
    playerVars: {
      type: Object,
      default () {
        return { rel: 0 }
      }
    },
    videoId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      header: 'orbit-helper',
      interval: UPDATE_INTERVAL_PLAYING,
      time: 0, // elapsed time in seconds (with decimals)
      timer: null,
      shouldPauseOnNewComment: false,
      shouldShowComposer: true,
      visibleCommentCount: 0
    }
  },
  computed: {
    newCommentPauseFn () {
      return this.shouldPauseOnNewComment ? this.pausePlayer : noop
    }
  },
  methods: {    
    commentDelete (commentId) {
      this.$emit('commentDelete', commentId)
    },
    commentEdit (commentId, time, text) {
      this.$emit('commentEdit', { commentId, time, text })
    },
    commentFetchNext () {
      this.$emit('commentFetchNext')
    },
    commentPost ({ time, text }) {
      this.$emit('commentPost', { time, text })
    },
    jumpTo (timeInSeconds) {
      // jump video to time (given in seconds, ex: 4.2157)
      this.player && this.player.seekTo(timeInSeconds)
    },
    pausePlayer () {
      /* Programatically pause current video */
      this.player.pauseVideo()
    },
    playerEnded (event) { /* Received player event: Video has ended */ },
    playerPaused (event) { /* Received player event: Video was paused */ },
    playerPlaying (event) {
      /* Received player event: Video is now playing */
      this.startTimer()
    },
    playerReady (event) {
      /* Received player event: Youtuber player is ready */
      this.player = event.target
    },
    resetTimer () {
      /* Clears timer */
      clearInterval(this.timer)
      this.timer = null
    },
    startTimer () {
      /* 
        Starts timer, does not start a timer if one is ongoing
        Every `interval` msec, `time` is set to the elapsed time in sec
       */
      if (!this.player || this.timer) return
      this.timer = setInterval(() => {
        this.time = this.player.getCurrentTime()
      }, this.interval)
    }
  },
  beforeDestroy () {
    this.resetTimer()
  }
}
</script>

<style lang="scss">
.toggler {
  margin: 0 50px;
  -webkit-touch-callout: none; /* iOS Safari */
     -webkit-user-select: none; /* Safari */
      -khtml-user-select: none; /* Konqueror HTML */
        -moz-user-select: none; /* Firefox */
         -ms-user-select: none; /* Internet Explorer/Edge */
             user-select: none; /* Non-prefixed version, currently
                                   supported by Chrome and Opera */
}
</style>