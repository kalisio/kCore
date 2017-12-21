<template>
  <div v-show="tabBar.tabs.length > 0">
    <q-tabs align="justify" @select="onCurrentTabChanged" inverted>
      <template v-for="tab in tabBar.tabs">
        <q-route-tab slot="title" 
          v-bind:key="tab.name"
          :default="tab.default" 
          :name="tab.name" 
          :label="tab.label" 
          :icon="tab.icon" 
          :to="tab.route"/>
      </template>
    </q-tabs>
  </div>
</template>

<script>
import _ from 'lodash'
import { QTabs, QRouteTab } from 'quasar'

export default {
  name: 'k-tab-bar',
  components: {
    QTabs,
    QRouteTab
  },
  data () {
    return {
      tabBar: { tabs: [] }
    }
  },
  methods: {
    onCurrentTabChanged (newTab) {
      if (this.$route.name !== newTab) {
        let tab = _.find(this.tabs, tab => tab.name === newTab)
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
    this.$store.set('tabBar', this.tabBar)
  }
}
</script>
