<template>
  <k-dialog ref="dialog" :title="title" :actions="actions" @action-triggered="onActionTriggered">
    <!-- 
      Content section
     -->
    <div slot="dialog-content">
      <k-form ref="form" :schema="schema" @form-ready="fillEditor" />
    </div>
  </k-dialog>
</template>

<script>
import { KDialog } from '../frame'
import { KForm } from '../form'
import mixins from '../../mixins'

export default {
  name: 'k-popup-editor',
  components: {
    KDialog,
    KForm
  },
  mixins: [
    mixins.service,
    mixins.objectProxy,
    mixins.baseEditor
  ],
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  computed: {
    actions () {
      let actions = []
      if (this.applyButton != '') actions.push(this.applyButton)
      if (this.clearButton != '') actions.push(this.clearButton)
      if (this.resetButton != '') actions.push(this.resetButton)
      return actions
    }
  },
  methods: {
    onActionTriggered (action) {
      switch (action) {
        case this.clearButton: 
          this.clear()
          return
        case this.resetButton: 
          this.reset()
          return
        default:
          this.apply()
      }
    },
    open (clear) {
      if (clear) this.$refs.form.clear()
      this.$refs.dialog.open()
    },
    close () {
      this.$refs.dialog.close()
    }
  },
  created () {
    this.$on('applied', _ => this.$refs.dialog.close())
  }
}
</script>