<template>
  <div class="column justify-center"> 
    <!-- 
      Filter section 
    -->
    <div class="row justify-between gutter">
      <q-icon class="col-1" name="flag" />
      <k-pattern-filter class="col-5" @filter-changed="onFilterChanged" />
      <q-icon class="col-1" name="label" />
      <k-tag-filter :scope="service" class="col-5" @filter-changed="onFilterChanged" />
    </div>
    <!-- 
      Items section 
    -->
    <div class="row">
      <div v-for="item in items" :key="item" :class="layout">
        <k-renderer :item="item" :actions="actions" />
      </div>
    </div>
    <div class="self-center">
      <q-pagination v-model="currentPage" :max="nbPages" style="padding: 18px" @input="onPageChanged" />
    </div>
  </div>
</template>

<script>
import { QPagination, QIcon } from 'quasar'
import KTagFilter from './KTagFilter.vue'
import KPatternFilter from './KPatternFilter.vue'
import mixins from '../../mixins'

export default {
  name: 'k-grid',
  components: {
    QIcon,
    QPagination,
    KTagFilter,
    KPatternFilter
  },
  mixins: [mixins.service, mixins.baseCollection],
  props: {
    layout: {
      type: String,
      default: 'col-xs-12 col-sm-6 col-lg-4 col-xl-3'
    },
    renderer: {
      type: String,
      default: 'collection/KCard'
    }
  },
  created () {
    // Load the component
    let loadComponent = this.$store.get('loadComponent')
    this.$options.components['k-renderer'] = loadComponent(this.renderer)
    this.refreshCollection()
    // Subscribe to the service changed event
    this.$on('service-changed', _ =>  {
      this.refreshCollection()
    })
  }
}
</script>
