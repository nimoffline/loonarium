<template>
<div class="orbit-helper container" :style="elementStyle">
  <div class="row">
    <div id="orbithelper-video" class="col-xs-12 col-md-8 col-lg-7 orbithelper-video">
      <youtube
        player-width="100%"
        :player-height="400"
        :video-id="videoCode"
        :player-vars="playerVars"
        @ended="playerEnded"
        @paused="playerPaused"
        @playing="playerPlaying"
        @ready="playerReady"
      />
    </div>
    <div id="orbithelper-comments" class="col-xs-12 col-md-4 col-lg-5 align-left orbithelper-comments">
      <ul>
        <label class="toggler">
          <input
            v-model="shouldPauseOnNewComment"
            type="checkbox"/>
            Pause on next comment
        </label><br/>
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
        :commentNextPageBuffer="commentNextPageBuffer"
        :elapsedSeconds="time"
        :onShowNewComment="newCommentPauseFn"
        :style="commentListStyle"
        :jumpToTime="jumpTo"
        :totalCommentCount="totalCommentCount"
        @commentFetchNext="commentFetchNext"
        @commentEdit="commentEdit"
        @commentDelete="commentDelete"
      />
    </div>
  </div>
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
    totalCommentCount: {
      type: Number,
      default: 0
    },
    videoCode: {
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
    commentPost ({ time, text, clearTextAreaFn }) {
      this.$emit('commentPost', { time, text, clearTextAreaFn })
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
.orbit-helper {
  width: 100%;
  text-align: left;
  margin: 0 auto;
}

.orbithelper-comments {
  text-align: left;
}

.orbithelper-video {
  text-align: center;
}

.toggler {
  -webkit-touch-callout: none; /* iOS Safari */
     -webkit-user-select: none; /* Safari */
      -khtml-user-select: none; /* Konqueror HTML */
        -moz-user-select: none; /* Firefox */
         -ms-user-select: none; /* Internet Explorer/Edge */
             user-select: none; /* Non-prefixed version, currently
                                   supported by Chrome and Opera */
}
</style>