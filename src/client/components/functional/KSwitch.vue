<template>
  <component v-if="component !== ''" :is="component" v-bind="$props" />
</template>

<script>
import _ from 'lodash'

export default {
  name: 'k-swtich',
  // We must define the properties as we are facing a bug in Vue-router
  // https://github.com/vuejs/vue-router/pull/1702
  // TODO: once corrected, vue-router should define all dynamic segment within $attrs
  // Then the switch statement should be done using the defined $attr (i.e. 'action')
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
  data () {
    return {
      component: ''
    }
  },
  watch: {
    '$route': function $route(to, from) {
      // React to route changes and reconfigure the components if needed
      this.update();
    }
  },
  methods: {
    update () {
      // Retrieve the switch key according the action if any
      let key = this.action !== '' ? this.action : 'default'
      // Retrieve the component name assigned to the key within the configuration file
      let componentName = this.$store.get('config.switch.' + key)
      if (componentName) {
        // Assign a key to the component in order to identify it
        let componentKey = _.kebabCase(componentName)
        // Check whether the requested component is already loaded using its key. 
        if (!this.$options.components[componentKey]) {
          // Load the component and store it
          let loadComponent = this.$store.get('loadComponent')
          this.$options.components[componentKey] = loadComponent(componentName)
        }
        // Tell the switch to render the component
        this.component = componentKey
      } else {
        this.component = ''
      }
    }
  },
  created () {
    this.update()
  }
}
</script>