<template>
  <q-layout ref="layout" view="lHr LpR lFf">
    <!--
      The AppBar
    -->
    <div slot="header">
      <k-app-bar @menu-clicked="onMenuToggled" />
    </div>
    <!--
      The SideNav
    -->
    <div slot="left">
      <k-side-nav />
    </div>
    <!--
      The navbar
     -->
    <div slot="navigation">
      <k-tab-bar />
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
  methods: {
    onMenuToggled () {
      this.$refs.layout.toggleLeft()
    }
  },
  created () {
    // Retrieve the loadComponent function and load the components
    // We need this so that we can dynamically load the component
    // with a function that has previously been statically analyzed by the bundler (eg webpack)
    this.$options.components['k-app-bar'] = this.$load(this.$config('layout.appBar', 'layout/KAppBar'))
    this.$options.components['k-tab-bar'] = this.$load(this.$config('layout.navBar', 'layout/KTabBar'))
    this.$options.components['k-side-nav'] = this.$load(this.$config('layout.sideNav', 'layout/KSideNav'))
  },
  mounted () {
    Events.$on('speech-recognition', phrases => {
      if (phrases.includes('menu')) this.onMenuToggled()
    })
  }
}
</script>
