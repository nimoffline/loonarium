<template>
  <div class="single-comment fade-in" v-if="!!comment">
    <strong>{{commentAuthor}} </strong><a href="#video-comment-player-video" class="gray" @click="jumpToComment">{{commentTime}}</a>
    <span class="no-select">&nbsp;</span>
    <span class="edit-start gray" v-if="canEdit && !isEditing" @click="startEditing">Edit</span>
    <span class="edit-start gray" v-if="isEditing" @click="cancelEditing">Cancel</span>
    <span class="no-select" v-if="isEditing">&nbsp;</span>
    <span class="edit-start gray" v-if="isEditing" @click="deleteComment">Delete</span>

    <br/>
    <span v-if="!isEditing" v-html="commentText"></span>
    <div v-if="isEditing">
      <input name="editor-time" class="editor-time" type="number" step="0.05" v-model="newCommentTime" min="0">
      <label for="editor-time">Time (sec.)</label>
      <textarea class="editor-text" rows="4" v-model="newCommentText"/>
      <br/>
      <button class="btn editor-save" @click="confirmEdit">Save</button>
    </div>
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
    currentUserId: {
      type: String,
      default: '',
    },
    jumpToTime: Function,
    editingCommentIdAdd: Function,
    editingCommentIdRemove: Function
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
      return this.comment.text
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
  }
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
    color: blue;
  }  
}

.fade-in {
   -webkit-animation-name: fade-in;
           animation-name: fade-in;
}

.single-comment {
  color: black;
  white-space: pre-wrap;
  -webkit-animation-duration: 0.7s;
          animation-duration: 0.7s;
}

span {
  margin: 0 0;
}

.editor-time {
  margin: 4px 0;
  width: 70px;
}

.editor-text {
  width: 100%;
}

.gray {
  color: gray;
}
</style>
