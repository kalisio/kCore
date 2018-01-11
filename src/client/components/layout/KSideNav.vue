<template>
  <div>
    <div v-if="banner != ''" class="row justify-center items-center">
      <img :src="banner">
    </div>
    <template v-for="component in components">
      <component :key="component.name" :is="component.renderer" :name="component.name" />
    </template>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'k-side-nav',
  inject: ['layout'],
  provide () {
    return {
      sideNav: this
    }
  },
  data () {
    return {
      banner: '',
      components: []
    }
  },
  methods: {
    navigate (route) {
      this.layout.hideCurrentSide(() => this.$router.push(route))
    }
  },
  created () {
    this.banner = this.$load(this.$config('sideNav.banner', 'kalisio-banner.png'), 'asset')
    // Setup the components structure
    // We build an array of components using the SideNav properties
    // A component is defined with 
    //   - the renderer: the Vue component to be used for the rendering
    //   - the name: the key to retrieve the configuration
    
    let content = this.$config('sideNav.components', {})
    Object.entries(content).forEach(element => {
      // Setup the component
      let component = {}
      component.name = element[0]
      component.renderer = _.kebabCase(_.last(_.split(element[1], '/')))
      // Load the renderer
      if (! this.$options.components[component.key]) {
        this.$options.components[component.renderer] = this.$load(element[1])
      }
      // Add the component to the components array
      this.components.push(component)
    })
  }
}
</script>
