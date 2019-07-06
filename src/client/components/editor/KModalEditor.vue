<template>
  <k-modal ref="modal" :title="editorTitle" :toolbar="toolbar" :buttons="buttons" :route="router ? true : false" >
    <div slot="modal-content">
      <!-- TODO -->
      <k-form ref="form" :schema="schema" @field-changed="onFieldChanged"/>
    </div>
  </k-modal>
</template>

<script>
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
        { name: 'apply-button', label: this.applyButton, color: 'primary', handler: (event) => this.apply(event) }
      ]
      if (this.clearButton !== '') {
        buttons.push({
          name: 'clear-button', label: this.clearButton, color: 'primary', handler: (event) => this.clear(event)
        })
      }
      if (this.resetButton !== '') {
        buttons.push({
          name: 'reset-button', label: this.resetButton, color: 'primary', handler: (event) => this.reset(event)
        })
      }
      return buttons
    }
  },
  data () {
    return {
      toolbar: [{
        name: 'close',
        icon: 'close',
        handler: () => this.close(this.router ? _ => this.$router.push(this.router.onDismiss) : this.$emit('closed'))
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
    },
    onFieldChanged (field, value) {
      this.$emit('field-changed', field, value)
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