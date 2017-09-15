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
  mixins: [mixins.service],
  props: {
    actions: {
      type: Array,
      default: function () {
        return []
      }
    },
    layout: {
      type: String,
      default: 'col-xs-12 col-sm-6 col-lg-4 col-xl-3'
    }
  },
  data () {
    return {
      items: [],
      nbTotalItems: 0,
      nbItemsPerPage: 12,
      currentPage: 1
    }
  },
  computed: {
    nbPages () {
      return Math.ceil(this.nbTotalItems / this.nbItemsPerPage)
    },
    hasFilter () {
      return this.filter !== ''
    }
  },
  methods: {
    update () {
      // Setup the configuration path using the service as a prefix
      let confPath = `config.${this.service}_grid`
      // Retrieve the number of items per page
      this.nbItemsPerPage = this.$store.get(confPath + '.nbItemsPerPage', 12)
      // Retrieve the required components
      let loadComponent = this.$store.get('loadComponent')
      let renderer = this.$store.get(confPath + '.renderer', 'collection/KCard')
      if (this.renderer !== renderer) {
        this.$options.components['k-renderer'] = loadComponent(renderer)
        this.renderer = renderer
      }
      let filter = this.$store.get(confPath + '.filter', 'collection/KFilter')
      if (this.filter !== filter) {
        this.$options.components['k-filter'] = loadComponent(filter)
        this.filter = filter
      }
      // Clears the query
      this.query = {}
      this.filterQuery = {}
      this.updateItems()
    },
    updateItems () {
      if (this.isServiceValid()) {
        let query = Object.assign({}, this.filterQuery)
        // Sets the number of items to be loaded
        if (this.nbItemsPerPage > 0) {
          Object.assign(query, {
            $limit: this.nbItemsPerPage,
            $skip: (this.currentPage - 1) * this.nbItemsPerPage
          })
        }
        // find the desire items
        this.serviceFind({
          rx: {
            listStrategy: 'always'
          },
          query
        }).subscribe(response => {
          this.items = response.data
          this.nbTotalItems = response.total
        })
      }
    },
    onPageChanged () {
      this.updateItems()
    },
    onFilterChanged (filterQuery) {
      this.filterQuery = Object.assign({}, filterQuery)
      this.updateItems()
    }
  },
  created () {
    this.renderer = ''
    this.filter = ''
    this.filterQuery = {}
    this.update()
    // Subscribe to the service changed event
    this.$on('service-changed', _ =>  {
      this.update()
    })
  }
}
</script>
