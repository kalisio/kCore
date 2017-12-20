<template>
  <div v-show="currentTabs.length > 0">
    <q-tabs v-model="currentTab" align="justify" @select="onCurrentTabChanged" inverted>
      <template v-for="tab in currentTabs">
        <q-route-tab slot="title" :name="tab.name" :label="tab.label" :icon="tab.icon" :to="tab.route"/>
      </template>
    </q-tabs>
  </div>
</template>

<script>
import lodash from 'lodash'
import { Events, QTabs, QRouteTab } from 'quasar'

export default {
  name: 'k-tab-bar',
  components: {
    QTabs,
    QRouteTab
  },
  props: {
    tabs: {
      type: Array,
      default: () => []
    },
    selected: {
      type: String,
      default: ''
    }
  },
 /* watch: {
    selected: function () {
      this.updateCurrentTab()
    }
  },*/
  data () {
    return {
      currentTab: '',
      currentTabs: []
    }
  },
  methods: {
    updateTabs () {
      this.currentTabs = this.$store.get('navBar.tabs', [])
      this.currentTab = this.$store.get('navBar.currentTab')
    },
    updateCurrentTab () {
      this.currentTab = this.selected
    },
    onCurrentTabChanged (newTab) {
      if (this.$route.name !== newTab) {
        let tab = lodash.find(this.tabs, tab => tab.name === newTab)
        if (tab) {
          // If a handler is given call it
          if (tab.handler) tab.handler.call(this)
          // If a route is given activate it
          if (tab.route) this.$router.push(tab.route)
        }
      }
    }
  },
  created () {
    this.currentTabs = this.tabs
    this.updateCurrentTab()
  },
  mounted () {
    Events.$on('nav-bar-tabs-changed', this.updateTabs)
  },
  beforeDestroy() {
    Events.$off('nav-bar-tabs-changed', this.updateTabs)
  }
}
</script>
