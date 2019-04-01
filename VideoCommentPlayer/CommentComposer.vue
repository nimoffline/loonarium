<template>
  <div class="comment-composer">
    <textarea
      class="composer-textarea"
      v-model="commentText"
      rows="5"
      placeholder="Enter something insightful about what's on screen right now!"
    />
    <br/>
    <button
      class="btn composer-button"
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
      const totalSeconds = Math.floor(this.elapsedSeconds)
      let minutes = Math.floor(totalSeconds / 60)
      let seconds = totalSeconds % 60
      if (minutes < 10) minutes = '0' + minutes
      if (seconds < 10) seconds = '0' + seconds
      return `${minutes}:${seconds}`
    }
  },
  data () {
    return {
      commentText: ''
    }
  },
  methods: {
    clearTextAreaFn () {
      this.commentText = '' 
    },
    submitComment () {
      this.$emit('post', {
        time: this.elapsedSeconds,
        text: this.commentText,
        clearTextAreaFn: this.clearTextAreaFn
      })
    }
  }
}
</script>

<style lang="scss">
.comment-composer {
  color: black;
  position: relative;
  margin-left: 25px;
}

.composer-textarea {
  width: 100%;
  padding: 12px 15px;
  background: transparent;
  border: 1px solid white;
  border-radius: 20px;
  color: white;
  resize: vertical;
}

.composer-button {
  font-size: 14px;
  position: absolute;
  bottom: 10px;
  right: 8px;
  border-radius: 20px;
  padding: 6px 10px 5px;
}

@media (max-width: 992px) {
  .comment-composer {
    margin: 10px 15px 0;
  }
}
</style>
