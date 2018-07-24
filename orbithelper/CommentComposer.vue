<template>
  <div class="comment-composer">
    <textarea
      class="composer-textarea"
      v-model="commentText"
      rows="5"
      cols="80"
      placeholder="Enter something insightful about what's on screen right now!"
    />
    <br/>
    <button
      class="composer-button"
      @click="submitComment"
    >Post at ~{{elapsedTime}}</button>
  </div>
</template>

<script>
export default {
  name: 'comment-composer',
  props: {
    elapsedSeconds: {
      type: Number,
      default: 0.0
    },
  },
  computed: {
    elapsedTime () {
      const totalSeconds = Math.round(this.elapsedSeconds, 1)
      let minutes = Math.floor(totalSeconds / 60)
      let seconds = totalSeconds % 60
      if (minutes < 10) minutes = '0' + minutes
      if (seconds < 10) seconds = '0' + seconds
      return `${minutes}:${seconds}`
    },
  },
  data () {
    return {
      commentText: ''
    }
  },
  methods: {
    submitComment () {
      this.$emit('post', { time: this.elapsedSeconds, text: this.commentText })
      this.commentText = '' 
      // TODO somehow make sure the comment posts successfully before clearing
    }
  }
}
</script>

<style lang="scss">
.comment-composer {
  color: black;
  padding-top: 20px;
}

.composer-textarea {
}

.composer-button {
}
</style>
