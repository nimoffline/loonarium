<template>
<div class="video-comment-player container" :style="elementStyle">
  <v-dialog />
  <div class="row">
    <div id="video-comment-player-video" class="col-xs-12 col-md-8 col-lg-7 video-comment-player-video">
      <youtube
        player-width="100%"
        :player-height="playerHeight"
        :video-id="videoCode"
        :player-vars="playerVars"
        @ended="playerEnded"
        @paused="playerPaused"
        @playing="playerPlaying"
        @ready="playerReady"
      />
    </div>
    <div id="video-comment-player-comments" class="col-xs-12 col-md-4 col-lg-5 align-left video-comment-player-comments">
      <ul>
        <label class="toggler">
          <input
            v-model="shouldPauseOnNewComment"
            type="checkbox"/>
            Pause on Comment
        </label> &nbsp;
        <label class="toggler">
          <input
            v-model="shouldShowComposer"
            type="checkbox"/>
            Comment Box
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
        :currentUserId="currentUserId"
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
  name: 'video-comment-player',
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
    currentUserId: {
      type: String,
      default: '',
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
      interval: UPDATE_INTERVAL_PLAYING,
      playerHeight: 400,
      time: 0, // elapsed time in seconds (with decimals)
      timer: null,
      shouldPauseOnNewComment: false,
      shouldShowComposer: false,
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
    commentEdit ({ comment, onSuccess }) {
      this.$emit('commentEdit', { comment, onSuccess })
    },
    commentFetchNext () {
      this.$emit('commentFetchNext')
    },
    commentPost ({ time, text, clearTextAreaFn }) {
      this.$emit('commentPost', { time, text, clearTextAreaFn })
    },
    handleWindowResize () {
      if (window.innerWidth < 500) this.playerHeight = 300
      else if (window.innerWidth < 770) this.playerHeight = 400
      else if (window.innerWidth < 1000) this.playerHeight = 500
    },
    jumpTo (timeInSeconds) {
      // jump video to time (given in seconds, ex: 4.2157)
      this.pausePlayer()
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
  mounted () {
    window.addEventListener('resize', this.handleWindowResize)
  },
  beforeDestroy () {
    this.resetTimer()
    window.removeEventListener('resize', this.handleWindowResize)
  }
}
</script>

<style lang="scss">
.red {
  color: red;
}

.video-comment-player {
  width: 100%;
  text-align: left;
  margin: 0 auto;
}

.video-comment-player-comments {
  text-align: left;
}

.video-comment-player-video {
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