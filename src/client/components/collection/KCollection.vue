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

export default {
  name: 'k-collection',
  components: {
    QList,
    QPagination
  },
  dependencies: ['api', 'store'],
  props: {
    service: {
      type: String,
      required: true
    },
    context: {
      type: String,
      default: ''
    },
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
      query: {},
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
    updateItems () {
      // Sets the number of items to be loaded
      if (this.nbItemsPerPage > 0) {
        this.query.$limit = this.nbItemsPerPage
        this.query.$skip = (this.currentPage - 1) * this.nbItemsPerPage
      }
      // find the desire items
      this.serviceApi.find({
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
      this.$emit('actionRequested', handler, item)
    }
  },
  created () {
    let Store = this.store()
    // Retrieve the API to the service
    this.serviceApi = this.api().getService(this.service, this.context)
    // Setup the configuration path using the service as a prefix
    let confPath = `config.${this.service}`
    // Retrieve the number of items per page
    this.nbItemsPerPage = Store.get(confPath + '.nbItemsPerPage', 12)
    // Retrieve the loadComponent function and load the components
    // We need this so that we can dynamically load the component
    // with a function that has previously been statically analyzed by the bundler (eg webpack)
    let loadComponent = Store.get('loadComponent')
    this.$options.components['k-filter'] = loadComponent(Store.get(confPath + '.filter', 'collection/KFilter'))
    this.$options.components['k-renderer'] = loadComponent(Store.get(confPath + '.renderer', 'collection/KCardItem'))
    this.$options.components['k-fab'] = loadComponent(Store.get(confPath + '.fab', 'collection/KFab'))
  },
  mounted () {
    // populate the vue
    this.updateItems()
  }
}
</script>
