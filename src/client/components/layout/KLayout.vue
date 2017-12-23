<template>
  <q-layout ref="layout" view="lHr LpR lFf">
    <!--
      The AppBar
    -->
    <div slot="header">
      <k-app-bar id="app-bar" @menu-clicked="onMenuToggled" />
    </div>
    <!--
      The SideNav
    -->
    <div slot="left">
      <k-side-nav id="side-nav" />
    </div>
    <!--
      The TabBar
     -->
    <div slot="navigation">
      <k-tab-bar id="tab-bar" />
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
    this.$options.components['k-app-bar'] = this.$load(this.$config('layout.appBar', 'layout/KAppBar'))
    this.$options.components['k-tab-bar'] = this.$load(this.$config('layout.tabBar', 'layout/KTabBar'))
    this.$options.components['k-side-nav'] = this.$load(this.$config('layout.sideNav', 'layout/KSideNav'))
  },
  mounted () {
    Events.$on('speech-recognition', phrases => {
      if (phrases.includes('menu')) this.onMenuToggled()
    })
  }
}
</script>
