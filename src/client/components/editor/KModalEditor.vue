<template>
  <k-modal :title="title" :toolbar="toolbar" :buttons="buttons" >
    <div slot="modal-content">
      <k-form ref="form" :schema="schema" />
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
    title: {
      type: String,
      default: ''
    },
    backRoute: {
      type: String,
      required: true
    }
  },
  computed: {
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
      toolbar: [
        { name: 'Close', icon: 'close', handler: () => this.doClose() }
      ]
    }
  },
  methods: {
    doClose () {
      this.$router.push({name: this.backRoute})
    }
  },
  created () {
    this.refresh()
    this.$on('applied', _ => this.doClose())
  }
}
</script>