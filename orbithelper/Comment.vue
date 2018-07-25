<template>
  <div class="single-comment" v-if="!!comment">
    <strong>{{commentAuthor}} @ {{commentTime}}</strong>
    <br/>
    <span>{{commentText}}</span>
    <hr/>
  </div>
</template>

<script>
export default {
  name: 'comment',
  props: {
    comment: {
      type: Object,
      default () {
        return null
      }
    },
    commentDelete: Function,
    commentEdit: Function,
  },
  computed: {
    commentText () {
      if (!this.comment) return ''
      return this.comment.text.trim()
    },
    commentTime () {
      if (!this.comment) return ''
      const totalSeconds = Math.floor(this.comment.time)
      let minutes = Math.floor(totalSeconds / 60)
      let seconds = totalSeconds % 60
      if (minutes < 10) minutes = '0' + minutes
      if (seconds < 10) seconds = '0' + seconds
      return `${minutes}:${seconds}`
    },
    commentAuthor () {
      if (!this.comment) return ''
      return this.comment.author
    }
  }
}
</script>

<style lang="scss">
.single-comment {
  color: black;
  white-space: pre-wrap;
}

span {
  margin: 0 0;
  --webkit-margin-before: 0;
}
</style>
