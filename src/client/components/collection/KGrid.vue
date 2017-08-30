<template>
  <div class="column justify-center"> 
    <!-- 
      Filter section 
    -->
    <div v-if="hasFilter">
      <k-filter @filter-changed="onFilterChanged" />
    </div>
    <!-- 
      Items section 
    -->
    <div class="row">
      <div v-for="item in items" :key="item" :class="layout">
        <k-renderer :item="item" :actions="filterActions('item')" @action-triggered="onActionTriggered" />
      </div>
    </div>
    <div class="self-center">
      <q-pagination v-model="currentPage" :max="nbPages" style="padding: 18px" @input="onPageChanged" />
    </div>
    <!--
      Fab section 
    -->
    <k-fab :actions="filterActions('fab')" @action-triggered="onActionTriggered" />
  </div>
</template>

<script>
import { QPagination } from 'quasar'
import mixins from '../../mixins'

export default {
  name: 'k-grid',
  components: {
    QPagination
  },
  mixins: [mixins.service, mixins.itemActions],
  props: {
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
      currentPage: 1,
      actions: []
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
        console.log('loading renderer')
        this.$options.components['k-renderer'] = loadComponent(renderer)
        this.renderer = renderer
      }
      let filter = this.$store.get(confPath + '.filter', 'collection/KFilter')
      if (this.filter !== filter) {
        this.$options.components['k-filter'] = loadComponent(filter)
        this.filter = filter
      }
      let fab = this.$store.get(confPath + '.fab', 'collection/KFab')
      if (this.fab !== fab) {
        this.$options.components['k-fab'] = loadComponent(fab)
        this.fab = fab
      }
      // Retrieve the actions
      this.actions = this.$store.get(confPath + '.actions')
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
        this.find({
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
    },
    filterActions (type = '') {
      return this.actions.filter(function (action) {
        return action.scope === type
      })
    },
    onActionTriggered (handler, item) {
      let action = this[handler]
      if (typeof action === 'function') {
        action.call(this, item)
      } else {
        logger.warn('[onActionRequested] invalid handler')
      }
    }
  },
  created () {
    this.renderer = ''
    this.filter = ''
    this.fab = ''
    this.filterQuery = {}
    this.update()
    // Subscribe to the service changed event
    this.$on('service-changed', _ =>  {
      this.update()
    })
  }
}
</script>
