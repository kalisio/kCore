<template>
  <k-dialog ref="dialog" :title="title">
    <!-- 
      Content section
     -->
    <div slot="dialog-content">
      <k-editor v-bind="$props" @applied="onApplied" />
    </div>
  </k-dialog>
</template>

<script>
import KEditor from './KEditor.vue'
import { KDialog } from '../frame'

export default {
  name: 'k-popup-editor',
  components: {
    KDialog,
    KEditor
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    context: {
      type: String,
      default: ''
    },
    service: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      default: ''
    },
    perspective: {
      type: String,
      default: ''
    }
  },
  methods: {
    onApplied () {
      this.close()
    },
    open () {
      this.$refs.dialog.open()
    },
    close () {
      this.$refs.dialog.close()
    }
  }
}
</script>