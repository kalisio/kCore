<template>
  <q-layout ref="layout" 
    v-model="sides"
    v-bind="options" 
    @left-breakpoint="onSideNavBreakpoint" 
    @right-breakpoint="onRightPanelBreakpoint">
    <!--
      The AppBar
    -->
    <div slot="header">
      <k-app-bar id="app-bar" :has-side-nav-toggle="!sides.left" @side-nav-toggled="onSideNavToggled" />
    </div>
    <!--
      The SideNav
    -->
    <div slot="left">
      <k-side-nav id="side-nav" :closable="sides.left" @side-nav-toggled="onSideNavToggled" />
    </div>
     <!--
      The right pane
    -->
    <div slot="right">
      <k-right-panel id="right-panel" :closable="sides.right" @right-panel-toggled="onRightPanelToggled" />
    </div>
    <!--
      The TabBar
     -->
    <div slot="navigation">
      <k-tab-bar id="tab-bar" />
    </div>
    <!-- 
      The search bar
     -->
    <k-search-bar id="search-bar" />
    <!--
      The Content area
    -->
    <router-view />
    <!--
     The Fab
    -->
    <k-fab id="fab" />
  </q-layout>
</template>

<script>
import _ from 'lodash'
import { QLayout, Events } from 'quasar'

export default {
  name: 'k-layout',
  components: {
    QLayout
  },
  data () {
    return {
      sides: {
        left: false,
        right: false
      },
      options: {}
    }
  },
  methods: {
    onSideNavToggled () {
      this.$refs.layout.toggleLeft()
    },
    onSideNavBreakpoint (toggle) {
      this.sides.left = toggle
    },
    onRightPanelToggled () {
      this.$refs.layout.toggleRight()
    },
    onRightPanelBreakpoint (toggle) {
      this.sides.right = toggle
    }
  },
  created () {
    this.options = this.$config('layout')
    this.$options.components['k-app-bar'] = this.$load(_.get(this.options, 'appBar', 'layout/KAppBar'))
    this.$options.components['k-side-nav'] = this.$load(_.get(this.options, 'sideNav', 'layout/KSideNav'))
    this.$options.components['k-right-panel'] = this.$load(_.get(this.options, 'rigthPanel', 'layout/KRightPanel'))
    this.$options.components['k-search-bar'] = this.$load(_.get(this.options, 'searchBar', 'layout/KSearchBar'))
    this.$options.components['k-tab-bar'] = this.$load(_.get(this.options, 'tabBar', 'layout/KTabBar'))
    this.$options.components['k-fab'] = this.$load(_.get(this.options, 'fab', 'layout/KFab'))
  },
  mounted () {
    Events.$on('speech-recognition', phrases => {
      if (phrases.includes('menu')) this.onMenuToggled()
    })
  }
}
</script>
