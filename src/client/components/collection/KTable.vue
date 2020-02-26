<template>
  <div>
    <div v-if="items.length > 0">
      <q-table
        :title="title"
        :data="items"
        :columns="columns"
        :selection="selection"
        :selected.sync="selectedItems"
        @selection="onSelectionChanged"
        row-key="_id"
        :pagination.sync="pagination"
        @request="onRequest"
      />
    </div>
    <div v-else class="row justify-center text-center">
      <div class="q-ma-xl">
        <q-icon size="3rem" name="error_outline" />
        <p>{{$t('KList.EMPTY_LIST')}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { QTable } from 'quasar'
import mixins from '../../mixins'

export default {
  name: 'k-table',
  mixins: [mixins.service, mixins.schemaProxy, mixins.baseCollection],
  components: {
    QTable
  },
  props: {
    baseQuery: {
      type: Object,
      default: function () {
        return {}
      }
    },
    filterQuery: {
      type: Object,
      default: function () {
        return {}
      }
    },
    title: {
      type: String
    },
    selection: {
      type: String
    },
    listStrategy: {
      type: String
    }
  },
  data () {
    return {
      tableQuery: {
        $sort: { _id: 1 } // Implicit default sort
      },
      columns: [],
      selectedItems: [],
      pagination: {
        sortBy: '_id',
        descending: false,
        page: 1,
        rowsPerPage: this.nbItemsPerPage
      }
    }
  },
  watch: {
    '$route' (to, from) {
      // React to route changes but reusing the same component as this one is generic
      this.refreshCollection()
    },
    baseQuery: function () {
      this.refreshCollection()
      this.currentPage = 1
    },
    filterQuery: function () {
      this.refreshCollection()
      this.currentPage = 1
    }
  },
  methods: {
    getCollectionBaseQuery () {
      return this.baseQuery
    },
    getCollectionFilterQuery () {
      return Object.assign({}, this.tableQuery, this.filterQuery)
    },
    processSchema () {
      this.columns = []
      _.forOwn(this.schema.properties, (value, key) => {
        const type = _.get(value, 'type')
        // FIXME: allow for custom representation of complex objects
        if (type === 'object') return
        const label = _.get(value, 'field.label', _.get(value, 'field.helper', key))
        const format = _.get(value, 'format')
        this.columns.push({
          name: key,
          // Check if we have a translation key or directly the label content
          label: (this.$i18n.i18next.exists(label) ? this.$t(label) : label),
          field: row => _.get(row, key),
          align: 'center',
          sortable: true,
          format: (value) => {
            switch (type) {
              case 'number':
                return value.toFixed(2)
                break
              case 'integer':
                return value.toFixed(0)
                break
              case 'string':
                return (format === 'date-time' ? moment.utc(value).format() : value) 
                break
              default:
                return value.toString()
            }
          }
        })
      })
    },
    onCollectionRefreshed () {
      // Update pagination for table
      this.pagination.rowsNumber = this.nbTotalItems
    },
    onRequest (props) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination
      this.currentPage = page
      this.tableQuery.$sort = { [sortBy]: (descending ? -1 : 1) }
      this.refreshCollection()
      // don't forget to update local pagination object
      this.pagination.page = page
      this.pagination.rowsPerPage = rowsPerPage
      this.pagination.sortBy = sortBy
      this.pagination.descending = descending
    },
    onSelectionChanged (data) {
      if (this.selection === 'single') {
        if (data.added) this.onItemSelected(data.rows[0])
        else this.onItemSelected(null)
      } else {
        if (data.added) this.onItemsSelected(this.selectedItems.concat(data.rows))
        else this.onItemsSelected(this.selectedItems.filter(item => !_.find(data.rows, { _id: item._id })))
      }
    }
  },
  async created () {
    // Whenever the user abilities are updated, update collection as well
    this.$events.$on('user-abilities-changed', this.refreshCollection)
    await this.loadSchema(this.service + '.get')
    this.processSchema()
    this.refreshCollection()
  },
  mounted () {
    this.$on('collection-refreshed', this.onCollectionRefreshed)
  },
  beforeDestroy () {
    this.$events.$off('user-abilities-changed', this.refreshCollection)
    this.$off('collection-refreshed', this.onCollectionRefreshed)
  }
}
</script>
