import logger from 'loglevel'

let contextMixin = {
    watch: {
      '$route' (to, from) {
        // react to route changes with the same component
        let contextId = this.$route.params.context
        if (contextId !== this.$store.get('context._id')) {
          this.$store.set('context._id', contextId)
          this.$emit('context-changed', this.contextId)
        }
      }
    },
    methods: {
      ensureCompliance () {
        if (this.contextId !== this.$store.get('context._id')) {
          this.$store.set('context._id', this.contextId)
          this.$emit('context-changed', this.contextId)
        }
      }
    },
    created () {
      // Retrieve the context service
      this.contextService = this.$api.getService(this.$store.get('context.service'))
      if (!this.contextService) {
        logger.warn('The context service is not defined')
        return
      }
      // Ensure context compliance
      this.ensureCompliance()
      // Intall the listeners to the service 
      this.contextService.on('created', context => {
        this.$emit('new-context-created', context)
      })
      this.contextService.on('removed', context => {
        if (context._id === this.contexId) this.$emit('context-removed', context)
      })
      this.contextService.on('patched', context => {
        if (context._id === this.contexId) this.$emit('context-patched', context)
      })
      this.contextService.on('updated', context => {
        if (context._id === this.contexId) this.$emit('context-upated', context)
      })
    }
  }
  
  export default contextMixin
  