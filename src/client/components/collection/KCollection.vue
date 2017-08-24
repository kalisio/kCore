<template>
  <div class="column justify-center"> 
    <!-- 
      Filter section 
    -->
    <div v-if="hasFilter">
      <k-filter v-model="query" @filterChanged="onFilterChanged" />
    </div>
    <!-- 
      Items section 
    -->
    <div class="row">
      <div v-for="item in items" :key="item" :class="layout">
        <k-renderer :item="item" :actions="filterActions('item')" @actionTrigerred="onActionTriggered" />
      </div>
    </div>
    <div class="self-center">
      <q-pagination v-model="currentPage" :max="nbPages" style="padding: 18px" @input="onPageChanged" />
    </div>
    <!--
      Fab section 
    -->
    <k-fab :actions="filterActions()" @actionTrigerred="onActionTriggered" />
  </div>
</template>

<script>
import { QList, QPagination } from 'quasar'
import mixins from '../../mixins'

export default {
  name: 'k-collection',
  components: {
    QList,
    QPagination
  },
  props: {
    layout: {
      type: String,
      default: 'col-xs-12 col-sm-6 col-lg-4 col-xl-3'
    }
  },
  mixins: [
    mixins.service,
    mixins.createItem, 
    mixins.deleteItem, 
    mixins.editItem
  ],
  data () {
    return {
      query: {},
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
  watch: {
    service: function (parameters) {
      this.updateItems()
    }
  },
  methods: {
    updateItems () {
      // Sets the number of items to be loaded
      if (this.nbItemsPerPage > 0) {
        this.query.$limit = this.nbItemsPerPage
        this.query.$skip = (this.currentPage - 1) * this.nbItemsPerPage
      }
      // find the desire items
      this.find({
        rx: {
          listStrategy: 'always'
        },
        query: this.query
      }).subscribe(response => {
        this.items = response.data
        this.nbTotalItems = response.total
      })
    },
    onPageChanged () {
      this.updateItems()
    },
    onFilterChanged () {
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
    // Setup the configuration path using the service as a prefix
    let confPath = `config.${this.service.path}`
    // Retrieve the number of items per page
    this.nbItemsPerPage = this.$store.get(confPath + '.nbItemsPerPage', 12)
    // Retrieve the loadComponent function and load the components
    // We need this so that we can dynamically load the component
    // with a function that has previously been statically analyzed by the bundler (eg webpack)
    let loadComponent = this.$store.get('loadComponent')
    this.$options.components['k-filter'] = loadComponent(this.$store.get(confPath + '.filter', 'collection/KFilter'))
    this.$options.components['k-renderer'] = loadComponent(this.$store.get(confPath + '.renderer', 'collection/KCardItem'))
    this.$options.components['k-fab'] = loadComponent(this.$store.get(confPath + '.fab', 'collection/KFab'))
  },
  mounted () {
    // populate the vue
    this.updateItems()
  }
}
</script>
