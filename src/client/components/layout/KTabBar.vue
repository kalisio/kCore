<template>
  <div v-show="tabBar.tabs.length > 0">
    <q-tabs align="justify" @select="onCurrentTabChanged" color="secondary">
      <template v-for="tab in tabBar.tabs">
        <q-route-tab
          :id="tab.id" 
          :key="tab.uid"
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

export default {
  name: 'k-tab-bar',
  data () {
    return {
      tabBar: this.$store.get('tabBar')
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
  }
}
</script>
