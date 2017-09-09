<template>
  <div v-show="tabs.length > 0">
    <q-tabs v-model="currentTab" align="justify" @select="onTabChanged" inverted>
      <template v-for="tab in tabs">
        <q-tab slot="title" :name="tab.name" :label="tab.label" :icon="tab.icon" />
      </template>
    </q-tabs>
  </div>
</template>

<script>
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
  data () {
    return {
      currentTab: ''
    }
  },
  methods: {
    onTabChanged (newTab) {
      if (this.$route.name !== newTab) {
        let tab = lodash.find(this.tabs, function(t) { return t.name === newTab })
        if (tab) {
          this.$router.push(tab.route)
        }
      }
    }
  },
  created () {
    this.currentTab = this.selected
  }
}
</script>
