let baseCollectionMixin = {
  props: {
    actions: {
      type: Array,
      default: function () {
        return []
      }
    },
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
    refreshCollection () {
      if (this.getService()) {
        let fullQuery = Object.assign({}, this.baseQuery, this.filterQuery)
        // Sets the number of items to be loaded
        if (this.nbItemsPerPage > 0) {
          Object.assign(fullQuery, {
            $limit: this.nbItemsPerPage,
            $skip: (this.currentPage - 1) * this.nbItemsPerPage
          })
        }
        // find the desire items
        this.getService().find({
          rx: {
            listStrategy: 'always'
          },
          query: fullQuery
        }).subscribe(response => {
          this.items = response.data
          this.nbTotalItems = response.total
          this.$emit('collection-refreshed')
        })
      }
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
  }
}

export default baseCollectionMixin
