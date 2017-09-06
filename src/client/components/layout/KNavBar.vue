<template>
  <div v-show="tabs.length > 0">
    <q-tabs v-model="selected" align="justify" @select="onTabChanged" inverted>
      <template v-for="tab in tabs">
        <q-tab slot="title" :name="tab.label" :label="tab.label" :icon="tab.icon" />
      </template>
    </q-tabs>
  </div>
</template>

<script>
import logger from 'loglevel'
import lodash from 'lodash'
import { QTabs, QTab } from 'quasar'

export default {
  name: 'k-nav-bar',
  components: {
    QTabs,
    QTab
  },
  props: {
    tabs: {
      type: Array,
      required: true
    },
    selected: {
      type: String,
      default: ''
    }
  },
  methods: {
    onTabChanged (newTab) {
      if (this.$route.name !== newTab) {
        let tab = lodash.find(this.tabs, function(t) { return t.label === newTab })
        if (tab) {
          this.$router.push(tab.route)
        }
      }
    }
  }
}
</script>
