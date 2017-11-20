<template>
  <q-search v-model="selection">
    <q-autocomplete @search="onSearch" @selected="onSelected" />
  </q-search>
</template>

<script>
import _ from 'lodash'
import { QSearch, QAutocomplete } from 'quasar'

export default {
  name: 'k-autocomplete',
  components: {
    QSearch,
    QAutocomplete
  },
  props: {
    services: {
      type: Array,
      required: true
    },
    processResults: {
      type: Function
    }
  },
  data () {
    return {
      selection: null
    }
  },
  methods: {
    onSearch (pattern, done) {
      // Perform request for partial match to all registered services
      const requests = this.services.map(item => {
        const service = this.$api.getService(item.service)
        // build the query using given templet if any
        let query = Object.assign({}, item.baseQuery)
        // Then add partial match
        // We don't use set by dot here because Mongo queries on nested fields
        // require the key to contain the path and not nested objects
        //_.set(query, item.field, { $search: pattern })
        query[item.field] = { $search: pattern }
        return service.find({ query })
      })
      Promise.all(requests).then(responses => {
        let results = []
        for (let i = 0; i < responses.length; i++) {
          const response = responses[i]
          const service = this.services[i]
          if (response.total > 0) {
            response.data.forEach(result => {
              Object.assign(result, {
                label: _.get(result, service.field),
                // Use object icon if provided, otherwise service-level icon
                icon: _.get(result, service.iconField) || service.icon,
                value: _.get(result, service.field)
              })
              results.push(result)
            })
          }
        }
        if (this.processResults) {
          this.processResults(pattern, results)
        }
        done(results)
      })
    },
    onSelected (item) {
      this.$emit('item-selected', item)
    }
  }
}
</script>
