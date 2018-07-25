<template>
  <div class="comment-list-div">
    <div class="comment-list">
      <div v-for="c in visibleComments" :key="c.id" >
        <comment :comment="c" />
      </div>
    </div>
    <hr/>
    <h3>{{commentCounter}}</h3>
  </div>
</template>

<script>
import Comment from './Comment.vue'

export default {
  name: 'comment-list',
  components: { Comment },
  props: {
    commentDelete: Function,
    commentEdit: Function,
    comments: {
      type: Array,
      default () {
        return []
      }
    },
    commentNextPageBuffer: {
      type: Number,
      default: 5
    },
    totalCommentCount: {
      type: Number,
      default: 0
    },
    elapsedSeconds: {
      type: Number,
      default: 0
    },
    onShowNewComment: Function
  },
  data () {
    return {
      lastCommentCount: 0,
    }
  },
  computed: {
    commentCounter () {
      return this.totalCommentCount
    },
    localCommentsLength () {
      return this.comments.length
    },
    visibleComments () {
      const arr = this.comments
      return arr.filter(cmt => this.elapsedSeconds >= cmt.time).reverse()
    },
    visibleCommentCount () {
      return this.visibleComments.length
    }
  },
  watch: {
    visibleCommentCount: {
      immediate: true, 
      handler (newCount, oldCount) {
        if (newCount > oldCount) this.onShowNewComment();
        if (newCount === this.localCommentsLength - this.commentNextPageBuffer) {
          this.$emit('commentFetchNext')
        }
      }
    }
  }
}
</script>

<style lang="scss">
.comment-list-div {
  margin: 5px 10%;
}
.comment-list {
  text-align: left;
  overflow-y: auto;
  overflow-wrap: break-word;
  min-height: 500px;
}
</style>
