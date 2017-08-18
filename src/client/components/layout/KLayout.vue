<template>
  <q-layout ref="layout" view="lHr LpR lFf">
    <!--
      The AppBar
    -->
    <div slot="header">
      <k-app-bar @menu-clicked="onMenuToggled" />
    </div>
    <!--
      The TabNav
    -->
    <div slot="navigation">
      <k-tab-nav />
    </div>
    <!--
      The SideNav
    -->
    <div slot="left">
      <k-side-nav />
    </div>
    <!--
      The Content area
    -->
    <router-view />
  </q-layout>
</template>

<script>
import { QLayout, Events } from 'quasar'

export default {
  name: 'k-layout',
  components: {
    QLayout
  },
  dependencies: ['store'],
  data () {
    return {}
  },
  methods: {
    onMenuToggled () {
      this.$refs.layout.toggleLeft()
    }
  },
  created () {
    let Store = this.store()
    // Retrieve the loadComponent function and load the components
    // We need this so that we can dynamically load the component
    // with a function that has previously been statically analyzed by the bundler (eg webpack)
    let loadComponent = Store.get('loadComponent')
    this.$options.components['k-app-bar'] = loadComponent(Store.get('config.layout.appBar', 'layout/KAppBar'))
    this.$options.components['k-tab-nav'] = loadComponent(Store.get('config.layout.tabNav', 'layout/KTabNav'))
    this.$options.components['k-side-nav'] = loadComponent(Store.get('config.layout.sideNav', 'layout/KSideNav'))
  },
  mounted () {
    Events.$on('speech-recognition', phrases => {
      if (phrases.includes('menu')) this.onMenuToggled()
    })
  }
}
</script>
