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
      <div v-for="item in items" :key="item._id" :class="layout">
        <k-renderer :item="item" :options="rendererOptions" :actions="actions" />
      </div>
    </div>
    <div class="self-center" v-if="nbPages > 1">
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
    },
    rendererOptions: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    '$route' (to, from) {
      // React to route changes but reusing the same component as this one is generic
      this.refreshCollection()
    }
  },
  created () {
    // Load the component
    this.$options.components['k-renderer'] = this.$load(this.renderer)
    this.refreshCollection()
  }
}
</script>
