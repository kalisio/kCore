<template>
  <k-modal ref="modal" :title="editorTitle" :toolbar="toolbar" :buttons="buttons" :route="router ? true : false" >
    <div slot="modal-content">
      <k-form ref="form" :schema="schema" :contextId="contextId" :objectId="objectId"/>
    </div>
  </k-modal>
</template>

<script>
import _ from 'lodash'
import { KModal } from '../frame'
import { KForm } from '../form'
import mixins from '../../mixins'

export default {
  name: 'k-modal-editor',
  components: {
    KModal,
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
    router: {
      type: Object,
      default: () => { return null }
    }
  },
  computed: {
    buttons () {
      let buttons = [
        { name: this.applyButton, color: 'primary', handler: (event, done) => this.apply(event, done) }
      ]
      if (this.clearButton != '') buttons.push({
        name: this.clearButton, color: 'primary', handler: (event, done) => this.clear(event, done)
      })
      if (this.resetButton != '') buttons.push({
        name: this.resetButton, color: 'primary', handler: (event, done) => this.reset(event, done)
      })
      return buttons
    }
  },
  data () {
    return {
      toolbar: [{ 
        name: 'close', 
        icon: 'close', 
        handler: () => this.close(this.router ? _ => this.$router.push(this.router.onDismiss) : null) 
      }]
    }
  },
  methods: {
    open () {
      this.refresh()
      this.$refs.modal.open()
    },
    close (onClose) {
      this.$refs.modal.close(onClose)
    }
  },
  created () {
    // Refresh the editor only when using a router. Otherwise it will be done when opening the editor
    if (this.router) this.refresh()
    this.$on('applied', _ => {
      if (this.router) this.close(() => this.$router.push(this.router.onApply))
    })
  }
}
</script>