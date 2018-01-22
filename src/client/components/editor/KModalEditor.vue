<template>
  <k-modal ref="modal" :title="title" :toolbar="toolbar" :buttons="buttons" :route="router ? true : false" >
    <div slot="modal-content">
      <k-form ref="form" :schema="schema" />
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
    title () {
      // Retuns the schema title
      if (this.getSchema()) {
        let schemaTitle = this.getSchema().title
        if (this.getMode() === 'create') return schemaTitle
        if (this.getObject()) return _.template(schemaTitle)({ object: this.getObject()})
      }
      return ''
    },
    buttons () {
      return [
        { name: this.applyButton, color: 'primary', handler: (event, done) => this.apply(event, done) },
      ]
      if (this.clearButton != '') actions.push({
        name: this.clearButton, color: 'primary', handler: (event, done) => this.clear(event, done)
      })
      if (this.resetButton != '') actions.push({
        name: this.resetButton, color: 'primary', handler: (event, done) => this.reset(event, done)
      })
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
      this.$refs.modal.open()
    },
    close (onClose) {
      this.$refs.modal.close(onClose)
    }
  },
  created () {
    this.refresh()
    this.$on('applied', _ => {
      if (this.router) this.close(_ => this.$router.push(this.router.onApply))
    })
  }
}
</script>