<template>
  <div class="comment-list-div">
    <div class="comments-titlebar">
      <h3 class="center center-block">Comments ({{ totalCommentCount }})</h3>
      <ul>
        <li class="toggler">
          <input
            id="cbx-pause-on-comment"
            v-model="shouldPauseOnNewComment"
            type="checkbox"/>
          <label
            for="cbx-pause-on-comment">
            Pause on Comment
          </label>
        </li> &nbsp;
        <li class="toggler">
          <input
            id="cbx-autoscroll"
            v-model="shouldAutoScroll"
            type="checkbox"/>
          <label
            for="cbx-autoscroll">
            Auto-scroll
          </label>
        </li> &nbsp;
        <li class="toggler">
          <input
            id="cbx-show-composer"
            v-model="shouldShowComposer"
            type="checkbox"/>
          <label
            for="cbx-show-composer">
            Comment Box
          </label>
        </li>
      </ul>
    </div>
    <comment-composer
      v-show="shouldShowComposer"
      :elapsedSeconds="elapsedSeconds"
      @post="commentPost"
    />
    <ol
      class="comment-list"
      id="comment-list"
      :style="{height: (height - 60) + 'px'}"
      ref="list">
      <comment
        v-for="(c, i) in comments"
        :key="c.id"
        :id="`cmt_${c.id}`"
        :comment="c"
        :currentUserId="currentUserId"
        :editingCommentIdAdd="editingCommentIdAdd"
        :editingCommentIdRemove="editingCommentIdRemove"
        :jumpToTime="jumpToTime"
        :opacity="getOpacity(i)"
        :highlighted="c.id === currentCmt.id"
        :color="commentColors[i]"
        @commentDelete="commentDelete"
        @commentEdit="commentEdit"
        @commentFetchNext="commentFetchNext"
      />
      <div class="empty-space"/>
    </ol>
  </div>
</template>

<script>
import CommentComposer from './CommentComposer.vue'
import Comment from './Comment.vue'
import {interpolateColors, rgbArrayToString} from '../src/utils/colors'

export default {
  name: 'comments',
  components: { Comment, CommentComposer },
  props: {
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
    onShowNewComment: Function,
    height: Number
  },
  data () {
    return {
      editingCommentIds: [],
      lastCommentCount: 0,
      shouldPauseOnNewComment: false,
      shouldShowComposer: false,
      shouldAutoScroll: true,
      currentCmt: {id: null, index: null} 
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
    },
    commentColors () {
      return interpolateColors('rgb(45, 200, 150)', 'rgb(255, 181, 97)', this.comments.length)
    }
  },
  methods: {
    editingCommentIdAdd (i) {
      this.editingCommentIds.push(i)
    },
    editingCommentIdRemove (i) {
      this.editingCommentIds = this.editingCommentIds.filter(cmtId => cmtId !== i)
    },
    commentPost ({ time, text, clearTextAreaFn }) {
      this.$emit('commentPost', { time, text, clearTextAreaFn })
    },
    commentDelete (commentId) {
      this.$emit('commentDelete', commentId)
    },
    commentEdit ({ comment, onSuccess }) {
      this.$emit('commentEdit', { comment, onSuccess })
    },
    commentFetchNext () {
      this.$emit('commentFetchNext')
    },
    getOpacity (index) {
      if (!this.currentCmt.index || this.currentCmt.index === index) return 1
      const diff = Math.abs(this.currentCmt.index - index)
      switch (diff) {
        case 1:
        case 2:
          return .8
        case 3:
        case 4:
          return .5
        default: return .4
      }
    },
    getScrollValue () {
      const nextChild = this.$children[this.currentCmt.index + 1]
      if (!nextChild) return -Infinity
      const { offsetHeight, offsetTop } = nextChild.$el
      const scrollValue = this.height > 300
        ? -(this.height / 2 - offsetHeight / 2) + offsetTop + 50
        : offsetTop
      return Math.max(0, scrollValue);
    },
    scrollTo (value) {
      if (value === -Infinity) return
      let current = this.$refs.list.scrollTop
      const backwards = current > value;
      const distance = Math.abs(current - value);
      let ratio = distance * 16 / 250;
      const interval = setInterval(() => {
        current = backwards ? current - ratio : current + ratio
        this.$refs.list.scrollTop = current
        if (backwards && current <= value || !backwards && current >= value) clearInterval(interval)
      }, 16);
    }
  },
  watch: {
    passedCommentCount: {
      immediate: true, 
      handler (newCount, oldCount) {
        if (newCount > oldCount) this.shouldPauseOnNewComment && this.onShowNewComment()
        if (newCount === this.localCommentsLength - this.commentNextPageBuffer) {
          this.$emit('commentFetchNext')
        }
      }
    },
    passedComments: {
      handler (newCmts=[], oldCmts=[]) {
        if (newCmts && oldCmts && newCmts.length === oldCmts.length) return
        const index = this.passedComments.length - 1
        if (!newCmts[index]) return
        this.currentCmt = {
          id: newCmts[index].id,
          index
        }
        const scrollValue = this.getScrollValue();
        if (this.shouldAutoScroll) this.scrollTo(scrollValue)
      }
    },
    shouldAutoScroll: {
      handler (isTrue) {
        if (isTrue) this.scrollTo(this.getScrollValue());
      }
    }
  },
  mounted () {
    this.$refs.list.addEventListener('wheel', () => {
      this.shouldAutoScroll = false
    })
  }
}
</script>

<style lang="scss">
.comment-list-div {
  margin: 5px 0;
}
.comments-titlebar {
  margin: 15px 0 15px 25px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  
  ul {
    padding: 0;
    margin: 3px 0 0;
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;
  }

  h3 {
    font-size: 20px;
    font-weight: 500;
    flex-grow: 1;
    display: inline-block;
    margin-right: 10px;
  }

  li {
    margin: 0;
  }
  
  li:not(:last-child) {
    margin: 0 10px 0 0;
  }
}
.comment-list {
  text-align: left;
  position: relative;
  overflow-wrap: break-word;
  overflow-y: auto;
  min-height: 500px;
  max-height: 1000px;
  padding: 0;
  border-width: 5px;
  margin-top: 20px;
}

.empty-space {
  height: 900px;
}

@media (max-width: 992px) {
  .comments-titlebar {
    margin: 7px 20px;
  }
  .comment-list {
    margin-top: 10px;
  }
}
</style>
