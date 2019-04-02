<template>
  <!--q-list highlight no-border-->
  <div>
    <q-list link no-border>
      <template v-for="(link,index) in links">
        <q-item v-if="link.label" :key="index" @click="onLinkClicked(link)" clickable v-ripple>
          <q-item-section avatar >
             <q-icon :name="link.icon" />
          </q-item-section>
          <q-item-section>
            <q-item-label inset>{{ $t(link.label) }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator v-else :key="index" />
      </template>
    </q-list>
  </div>
</template>

<script>
import { QList, QItem, QItemSection, QItemLabel, QIcon, QSeparator } from 'quasar'

export default {
  name: 'k-links-panel',
  components: {
    QList,
    QItem,
    QItemSection,
    QItemLabel,
    QIcon,
    QSeparator
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
      let route = { name: link.route.name }
      if (link.route.params) {
        let resolvedParams = Object.assign({}, link.route.params)
        if (resolvedParams.context) {
          let context = this.$store.get(resolvedParams.context)
          resolvedParams.context = context
        }
        route.params = resolvedParams
      }
      if (link.route.query) {
        route.query = Object.assign({}, this.$route.query)
      }
      (this.sideNav ? this.sideNav.navigate(route) : this.$router.push(route))
    }
  },
  created () {
    // Load the configuration
    this.links = this.$config(this.name + '.links')
  }
}
</script>
