<template>
  <div v-show="tabs.length > 0">
    <q-tabs v-model="selectedTab" align="justify" @select="onTabChanged" inverted>
      <template v-for="tab in tabs">
        <q-tab slot="title" :name="tab.route" :label="tab.label" :icon="tab.icon" :to="tab.route" />
      </template>
    </q-tabs>
  </div>
</template>

<script>
import { QTabs, QTab } from 'quasar'

export default {
  name: 'k-tab-nav',
  components: {
    QTabs,
    QTab
  },
  data () {
    return {
      tabs: [],
      selectedTab: ''
     }
  },
  methods: {
    onTabChanged (newTab) {
      if (this.$route.name !== newTab) {
        this.$router.push({ name: newTab })
      }
    }
  },
  watch: {
    '$route' (to, from) {
      this.tabs = []
      this.selectedTab = ''
      Object.entries(this.$store.get('config.tabNav')).forEach(entry => {
        entry[1].forEach(tab => {
          if (tab.route === to.name) {
            this.tabs = entry[1]
            this.selectedTab = tab.route
            return
          }
        })
      })
    }
  }
}
</script>
