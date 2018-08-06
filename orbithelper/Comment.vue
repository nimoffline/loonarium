<template>
  <div class="single-comment" v-if="!!comment">
    <strong>{{commentAuthor}} </strong><a href="#orbithelper-video" class="" @click="jumpToComment">{{commentTime}}</a>
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
    jumpToTime: Function,
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
      let centis = Math.round((this.comment.time - seconds) * 100);
      let centiStr = '' + centis
      if (centiStr.length === 1) {
        centiStr += '0'
      }
      return `${minutes}:${seconds}.${centiStr}`
    },
    commentAuthor () {
      if (!this.comment) return ''
      return this.comment.author
    }
  },
  methods: {
    jumpToComment () {
      this.jumpToTime(this.comment.time + 0.01)
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

a {
  color: gray;
}
</style>
