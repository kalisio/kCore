<template>
  <q-layout class="q-pa-md" ref="layout" v-bind="options">
    <!--
      The AppBar
    -->
    <q-header>
      <k-app-bar id="app-bar" :has-left-drawer-toggle="!leftDrawer" @left-drawer-toggled="leftDrawer=!leftDrawer" />
      <k-tab-bar id="tab-bar" />
      <k-search-bar id="search-bar" />
    </q-header>
    <!--
      The SideNav
    -->
    <q-drawer v-model="leftDrawer" v-bind="options.leftDrawer" side="left" bordered>
      <k-side-nav id="side-nav" :closable="options.leftDrawer.behavior !== 'mobile'" />
    </q-drawer>
     <!--
      The right pane
     -->
    <q-drawer v-model="rightDrawer" v-bind="options.rightDrawer" side="right" bordered>
      <k-right-panel id="right-panel" :closable="options.rightDrawer.behavior !== 'mobile'" />
    </q-drawer>
    <!--
      The Content area
    -->
    <q-page-container>
      <router-view />
    </q-page-container>
    <!--
     The Fab
    -->
    <k-fab id="fab" />
  </q-layout>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'k-layout',
  provide () {
    return {
      'klayout': this
    }
  },
  data () {
    return {
      leftDrawer: false,
      rightDrawer: false,
      options: {}
    }
  },
  methods: {
    showLeftDrawer () {
      this.leftDrawer = true
    },
    hideLeftDrawer () {
      this.leftDrawer = false
    },
    toggleLeftDrawer () {
      this.leftDrawer = !this.leftDrawer
    },
    showRightDrawer () {
      this.rightDrawer = true
    },
    hideRightDrawer () {
      this.rightDrawer = false
    },
    toggleRightDrawer () {
      this.rightDrawer = !this.rightDrawer
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

    if (this.options.showLeftDrawerOnStartup) {
      this.showLeftDrawer()
    }
  }
}
</script>
