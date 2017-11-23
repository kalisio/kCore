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
    mixins.schemaProxy,
    mixins.baseEditor(['form']),
    mixins.refsResolver(['form'])
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
  watch: {
    '$route' (to, from) {
      // React to route changes but reusing the same component as this one is generic
      this.refresh()
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
    this.refresh()
    this.$on('applied', _ => this.$refs.dialog.close())
  }
}
</script>