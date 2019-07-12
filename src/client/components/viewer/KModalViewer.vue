<template>
  <k-modal ref="modal" :title="viewerTitle" :toolbar="toolbar" :route="router ? true : false" >
    <div slot="modal-content">
      <k-view ref="view" :schema="schema"/>
    </div>
  </k-modal>
</template>

<script>
import { KModal } from '../frame'
import { KView } from '../view'
import mixins from '../../mixins'

console.log('je suis là', KModal, KView)
export default {
  name: 'k-modal-viewer',
  components: {
    KModal,
    KView
  },
  mixins: [
    mixins.service,
    mixins.objectProxy,
    mixins.schemaProxy,
    mixins.baseViewer(['view']),
    mixins.refsResolver(['view'])
  ],
  props: {
    router: {
      type: Object,
      default: () => { return null }
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
    }/*,
    onFieldChanged (field, value) {
      this.$emit('field-changed', field, value)
    }*/
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