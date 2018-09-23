<template>
  <div class="comment-list-div">
    <h3 class="center center-block">Comments ({{ totalCommentCount }})</h3>
    <div class="comment-list" id="comment-list">
      <comment
        v-for="c in comments"
        :key="c.id"
        :id="`cmt_${c.id}`"
        :comment="c"
        :currentUserId="currentUserId"
        :editingCommentIdAdd="editingCommentIdAdd"
        :editingCommentIdRemove="editingCommentIdRemove"
        :jumpToTime="jumpToTime"
        :passed="c.time < elapsedSeconds"
        @commentDelete="handleCommentDelete"
        @commentEdit="handleCommentEdit"
      />
      <div class="empty-space"/>
    </div>
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
    currentUserId: {
      type: String,
      default: '',
    },
    elapsedSeconds: {
      type: Number,
      default: 0
    },
    jumpToTime: Function,
    totalCommentCount: {
      type: Number,
      default: 0
    },
    onShowNewComment: Function
  },
  data () {
    return {
      editingCommentIds: [],
      lastCommentCount: 0
    }
  },
  computed: {
    commentCounter () {
      return this.totalCommentCount
    },
    localCommentsLength () {
      return this.comments.length
    },
    passedComments () {
      const arr = this.comments
      return arr
        .filter(cmt => this.elapsedSeconds >= cmt.time
          || this.editingCommentIds.indexOf(cmt.id) > -1)
    },
    passedCommentCount () {
      return this.passedComments.length
    }
  },
  methods: {
    handleCommentDelete (data) {
      this.$emit('commentDelete', data)
    },
    handleCommentEdit (data) {
      this.$emit('commentEdit', data)
    },
    editingCommentIdAdd (i) {
      this.editingCommentIds.push(i)
    },
    editingCommentIdRemove (i) {
      this.editingCommentIds = this.editingCommentIds.filter(cmtId => cmtId !== i)
    }
  },
  watch: {
    passedCommentCount: {
      immediate: true, 
      handler (newCount, oldCount) {
        if (newCount > oldCount) this.onShowNewComment()
        if (newCount === this.localCommentsLength - this.commentNextPageBuffer) {
          this.$emit('commentFetchNext')
        }
      }
    },
    passedComments: {
      handler (newCmts=[], oldCmts=[]) {
        if (newCmts && oldCmts && newCmts.length === oldCmts.length) return
        if (newCmts.length <= 2) return
        const lastCmt = newCmts[this.passedComments.length - 2]
        const cmtElement = document.getElementById(`cmt_${lastCmt.id}`)
        if (!cmtElement) return
        const topPos = cmtElement.offsetTop
        document.getElementById('comment-list').scrollTop = topPos - 20
      }
    }
  }
}
</script>

<style lang="scss">
.comment-list-div {
  margin: 5px 0;
}
.comment-list {
  text-align: left;
  overflow-wrap: break-word;
  overflow-y: auto;
  min-height: 500px;
  max-height: 1000px;
  padding: 5px;
  border-width: 5px;
  border: 1px solid gray;
}
.empty-space {
  height: 900px;
}
</style>
