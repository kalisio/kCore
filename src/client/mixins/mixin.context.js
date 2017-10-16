import logger from 'loglevel'
import { Events } from 'quasar'

let contextMixin = {
    props: {
      contextId: {
        type: String,
        default: ''
      }
    },
    watch: {
      contextId: function () {
        this.updateContext()
      }
    },
    methods: {
      updateContext () {
        this.$store.set('context._id', this.contextId)
        if (this.contextId !== '') {
          this.$api.getService(this.$store.get('context.service')).get(this.contextId)
          .then(context => {
            this.$store.set('context.subject', context)
            Events.$emit('context-changed', context)
          })
        } else {
          Events.$emit('context-changed', context)
        } 
      }
    },
    created () {
      this.updateContext()
    }
  }
  
  export default contextMixin
  