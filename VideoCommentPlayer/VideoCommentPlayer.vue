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
        ref="player"
        @ended="playerEnded"
        @paused="playerPaused"
        @playing="playerPlaying"
        @ready="playerReady"
      />
    </div>
    <div id="video-comment-player-comments" class="col-xs-12 col-md-4 col-lg-5 align-left video-comment-player-comments">
      <comments
        :comments="comments"
        :commentNextPageBuffer="commentNextPageBuffer"
        :currentUserId="currentUserId"
        :elapsedSeconds="time"
        :onShowNewComment="pausePlayer"
        :style="commentListStyle"
        :jumpToTime="jumpTo"
        :totalCommentCount="totalCommentCount"
        :height="playerHeight"
        @commentFetchNext="commentFetchNext"
        @commentEdit="commentEdit"
        @commentDelete="commentDelete"
        @commentPost="commentPost"
      />
    </div>
  </div>
</div>
</template>

<script>
import CommentComposer from './CommentComposer.vue'
import Comments from './Comments.vue'
import {
  UPDATE_INTERVAL_PAUSED,
  UPDATE_INTERVAL_PLAYING
} from './constants/numbers'

export default {
  name: 'video-comment-player',
  components: { CommentComposer, Comments },
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
      visibleCommentCount: 0
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
      if (window.innerWidth < 992) {
        this.playerHeight = 300
        return
      }
      if (window.innerHeight <= 900) this.playerHeight = 600
      else this.playerHeight = 800
    },
    jumpTo (timeInSeconds) {
      // jump video to time (given in seconds, ex: 4.2157)
      if (this.player.getPlayerState() !== 2) this.pausePlayer()
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
      this.handleWindowResize();
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
        this.time = Math.round(this.player.getCurrentTime() * 20) / 20;
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
  padding: 0;
}

.video-comment-player-video {
  text-align: center;
  padding: 0;
  border: 2px solid white;
  border-radius: 10px;
  overflow: hidden;
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
.row {
  padding: 30px 40px;
}
@media (max-width: 992px) {
  .video-comment-player-video {
    border: 0;
    border-radius: 0;
  }
}
</style>