<template>
  <!--q-list highlight no-border-->
  <div>
    <q-list link no-border>
      <template v-for="(link,index) in links">
        <q-item v-if="link.label" :key="index" @click="onLinkClicked(link)" item>
          <q-item-side :icon="link.icon" />
          <q-item-main :label="link.label" />
        </q-item>
        <q-item-separator v-else :key="index" />
      </template>
    </q-list>
  </div>
</template>

<script>
import logger from 'loglevel'
import lodash from 'lodash'
import { QList, QItem, QItemSide, QItemMain, QItemSeparator } from 'quasar'

export default {
  name: 'k-links-panel',
  components: {
    QList,
    QItem,
    QItemSide,
    QItemMain,
    QItemSeparator,
  },
  props: {
    name: {
      type: String,
      default: ''
    }
  },
  inject: ['sideNav'],
  data () {
    return {
      links: []
    }
  },
  methods: {
    onLinkClicked (link) {
      let resolvedParams = {}
      if (link.route.params) {
        Object.assign(resolvedParams, link.route.params)
        if (resolvedParams.context) {
          let context = this.$store.get(resolvedParams.context)
          resolvedParams.context = context
        }
      }
      this.sideNav.navigate({name: link.route.name, params: resolvedParams })
    }
  },
  created () {
    // Load the configuration
    this.links = this.$config(this.name + '.links')
  }
}
</script>
