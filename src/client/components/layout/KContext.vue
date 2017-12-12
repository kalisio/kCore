<template>
  <div v-if="contextLoaded">
    <router-view />
  </div>
</template>

<script>
import { Events } from 'quasar'

export default {
  name: 'k-context',
  props: {
    contextId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      contextLoaded: false
    }
  },
  watch: {
    '$route' (to, from) {
      // React to route changes but reusing the same component as this one is generic
      this.refreshContext()
    }
  },
  methods: {
    refreshContext () {
      if (this.contextId) {
        // Context already set ?
        if (this.context && this.context._id === this.contextId) return
        this.service.get(this.contextId)
        .then(context => {
          // Set context in store so that contextual services are aware of it
          this.$store.set('context', context)
          // Update actions to use current context
          this.actions.forEach(action => action.route.params['contextId'] = this.contextId)
          this.$store.set('appBar', { title: context.name, subtitle: context.description, actions: this.actions })
          this.contextLoaded = true
        })
      } else {
        this.$store.set('context', null)
        this.$store.set('appBar', null)
        this.contextLoaded = false
      }
    }
  },
  created () {
    this.actions = this.$store.get('config.context.actions', [])
    this.service = this.$api.getService(this.$store.get('config.context.service'))
    this.refreshContext()
  },
  beforeDestroy () {
    this.$store.set('context', null)
    this.$store.set('appBar', null)
  }
}
</script>
