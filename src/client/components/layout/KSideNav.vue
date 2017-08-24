<template>
  <div>
    <template v-for="component in components">
      <component :is="component.renderer" :name="component.name" />
    </template>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'k-side-nav',
  data () {
    return {
      components: []
    }
  },
  created () {
    // Retrieve the loadComponent function and load the components
    // We need this so that we can dynamically load the component
    // with a function that has previously been statically analyzed by the bundler (eg webpack)
    let loadComponent = this.$store.get('loadComponent')
    // Setup the components structure
    // We build an array of components using the SideNav properties
    // A component is defined with 
    //   - the renderer: the Vue component to be used for the rendering
    //   - the name: the key to retrieve the configuration
    let content = this.$store.get('config.sideNav', {})
    Object.entries(content).forEach(element => {
      // Setup the component
      let component = {}
      component.name = element[0]
      component.renderer = _.kebabCase(_.last(_.split(element[1], '/')))
      // Load the renderer
      if (! this.$options.components[component.key]) {
        this.$options.components[component.renderer] = loadComponent(element[1])
      }
      // Add the component to the components array
      this.components.push(component)
    })
  }
}
</script>
