import logger from 'loglevel'

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
      }
    },
    created () {
      this.updateContext()
    }
  }
  
  export default contextMixin
  