<template>
  <li
    :class="['single-comment', 'fade-in', highlighted ? 'highlighted' : '']"
    v-if="!!comment"
    :style="{opacity}"
  >
    <span class="author">{{commentAuthor}} </span><a href="#video-comment-player-video" class="timestamp" @click="jumpToComment">{{commentTime}}</a>
    <span class="no-select">&nbsp;</span>
    <span class="edit-start gray" v-if="canEdit && !isEditing" @click="startEditing">Edit</span>
    <span class="edit-start gray" v-if="isEditing" @click="cancelEditing">Cancel</span>
    <span class="no-select" v-if="isEditing">&nbsp;</span>
    <span class="edit-start gray" v-if="isEditing" @click="deleteComment">Delete</span>
    <p v-if="!isEditing" v-html="commentText"></p><!--
    --><div v-if="isEditing">
      <input name="editor-time" class="editor-time" type="number" step="0.05" v-model="newCommentTime" min="0">
      <label for="editor-time">Time (sec.)</label>
      <textarea class="editor-text" rows="4" v-model="newCommentText"/>
      <br/>
      <button class="btn editor-save" @click="confirmEdit">Save</button>
    </div>
  </li>
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
    currentUserId: {
      type: String,
      default: '',
    },
    jumpToTime: Function,
    editingCommentIdAdd: Function,
    editingCommentIdRemove: Function,
    highlighted: Boolean,
    opacity: Number
  },
  data () {
    return {
      isEditing: false,
      newCommentText: '',
      newCommentTime: null
    }
  },
  computed: {
    canEdit () {
      return this.currentUserId && ('' + this.currentUserId === '' + this.comment.author)
    },
    commentText () {
      if (!this.comment) return ''
      return this.comment.linkifiedText
    },
    commentTime () {
      if (!this.comment) return ''
      const totalSeconds = Math.floor(this.comment.time)
      let minutes = Math.floor(totalSeconds / 60)
      let seconds = totalSeconds % 60
      if (minutes < 10) minutes = '0' + minutes
      if (seconds < 10) seconds = '0' + seconds
      let centis = Math.round((this.comment.time - seconds) * 100)
      let centiStr = '' + centis
      if (centiStr.length === 1) {
        centiStr += '0'
      }
      return `${minutes}:${seconds}.${centiStr}`
    },
    commentAuthor () {
      if (!this.comment) return ''
      return this.comment.author_username
    }
  },
  methods: {
    jumpToComment () {
      this.jumpToTime(this.comment.time + 0.01)
    },
    startEditing () {
      this.isEditing = true
      this.editingCommentIdAdd(this.comment.id)
      this.newCommentText = this.comment.text
      this.newCommentTime = Math.round(this.comment.time*20)/20;
    },
    cancelEditing () {
      this.isEditing = false
      this.editingCommentIdRemove(this.comment.id)
      this.newCommentText = ''
      this.newCommentTime = null
    },
    confirmEdit () {
      const onSuccess = () => {
        this.isEditing = false
        this.editingCommentIdRemove(this.comment.id)
      }
      const data = {
        comment: {
          ...this.comment,
          text: this.newCommentText,
          time: this.newCommentTime,
        },
        onSuccess
      }
      this.$emit('commentEdit', data)
    },
    deleteComment () {
      const onConfirm = () => {
        this.$emit('commentDelete', this.comment.id)
        this.$modal.hide('dialog')
      }
      this.$modal.show('dialog', {
        clickToClose: true,
        title: 'Confirm Action',
        text: 'Are you sure you want to delete this comment?',
        buttons: [
          {
            title: 'Delete',
            class: 'vue-dialog-button red',
            handler: onConfirm
          },
          {
            title: 'Cancel'
          }
       ]
      })
    }
  },
  watch: {
    newCommentTime: {
      immediate: true, 
      handler (newTime) {
        if (!newTime) return
        if (newTime < 0) return
        this.jumpToTime(newTime)
      }
    }
  },
}
</script>

<style lang="scss">
@-webkit-keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.edit-start {
  cursor: pointer;
  user-select: none;

  &:hover {
    color: #ff8d39;
  }  
}

.fade-in {
   -webkit-animation-name: fade-in;
           animation-name: fade-in;
}

.single-comment {
  display: block;
  white-space: pre-wrap;
  -webkit-animation-duration: 0.7s;
          animation-duration: 0.7s;
  padding: 13px 25px;
  margin: 0;
  transition: .15s opacity;

  &:hover {
    opacity: 1 !important;
  }

  p {
    margin: 5px 0;
    font-size: 15px;
  }

  .timestamp {
    font-weight: 300;
    color: #2DC896;
    font-size: 16px;
    margin-left: 5px;
    opacity: .8;
    font-weight: 400;

    &:hover {
      opacity: 1;
    }
  }

  .author {
    font-size: 17px;
    font-weight: 800;
  }

  &.highlighted {
    opacity: 1;
    background: white;
    color: black;

    .timestamp {
      color: black;
    }
  }
}

span {
  margin: 0 0;
}

.editor-time {
  margin: 4px 0;
  width: 70px;
  background: transparent;
}

.editor-text {
  width: 100%;
  background: transparent;
}

.editor-save {
  padding: 5px 15px;
  background: #2DC896;
  color: white;
  border-radius: 20px;
  margin-left: calc(100% - 60px);
}

.full-opacity {
  opacity: 1.0;
}

.partial-opacity {
  opacity: .6;
}
</style>
