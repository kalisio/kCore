import { Events } from 'quasar'

let baseCollectionMixin = {
  props: {
    baseQuery: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  computed: {
    nbPages () {
      return Math.ceil(this.nbTotalItems / this.nbItemsPerPage)
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
  methods: {
    subscribe(query) {
      // Remove previous listener if any
      this.unsubscribe()
      this.itemListener = this.loadService().find({
        rx: {
          listStrategy: 'always'
        },
        query
      })
      .subscribe(response => {
        this.items = response.data
        this.nbTotalItems = response.total
        this.$emit('collection-refreshed')
      }, error => {
        Events.$emit('error', error)
      })
    },
    unsubscribe() {
      if (this.itemListener) {
        this.itemListener.unsubscribe()
        this.itemListener = null
      }
    },
    refreshCollection () {
      let fullQuery = Object.assign({}, this.baseQuery, this.filterQuery)
      // Sets the number of items to be loaded
      if (this.nbItemsPerPage > 0) {
        Object.assign(fullQuery, {
          $limit: this.nbItemsPerPage,
          $skip: (this.currentPage - 1) * this.nbItemsPerPage
        })
      }
      // find the desire items
      this.subscribe(fullQuery)
    },
    onPageChanged () {
      this.refreshCollection()
    },
    onFilterChanged (filterQuery) {
      this.filterQuery = Object.assign({}, filterQuery)
      this.refreshCollection()
    }
  },
  created () {
    this.filterQuery = {}
  },
  beforeDestroy() {
    this.unsubscribe()
  }
}

export default baseCollectionMixin
