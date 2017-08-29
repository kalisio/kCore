<template>
  <k-editor v-if="action === 'edit'" :context="context" :service="service" :id="id" :perspective="perspective" />
  <k-editor v-else-if="action === 'create'" :context="context" :service="service" />
  <k-browser v-else :context="context" :service="service" />
</template>

<script>
export default {
  name: 'k-collection',
  props: {
    context: {
      type: String,
      default: ''
    },
    service: {
      type: String,
      required: true
    },
    action: {
      type: String,
      default: '',
    },
    id : {
      type: String,
      default: '',
    },
    perspective: {
      type: String,
      default: ''
    }
  },
  watch: {
    '$route': function $route(to, from) {
      // React to route changes and reconfigure the components if needed
      this.configure();
    }
  },
  methods: {
    configure () {
      // Setup the configuration path using the service as a prefix
      let confPath = `config.components.${this.service}_collection`
      // Load the required components
      let loadComponent = this.$store.get('loadComponent')
      let browser = this.$store.get(confPath + '.browser', 'item/KGrid')
      if (this.browser !== browser) {
        this.$options.components['k-browser'] = loadComponent(browser)
        this.browser = browser
      }
      let editor = this.$store.get(confPath + '.component', 'editor/KEditor')
      if (this.editor !== editor) {
        this.$options.components['k-editor'] = loadComponent(editor)
        this.editor = editor
      }
    }
  },
  created () {
    this.browser = '',
    this.editor = '',
    this.configure()
  }
}
</script>
