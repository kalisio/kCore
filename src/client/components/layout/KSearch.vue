<template>
  <div>
    <q-search v-if="isVisible" v-model="pattern" inverted @change="onChanged">
      <q-autocomplete :debounce="500" @search="onSearch" @selected="onSelected" />
    </q-search>
  </div>
</template>

<script>
import { QSearch, QAutocomplete } from 'quasar'

export default {
  name: 'k-search',
  components: {
    QSearch,
    QAutocomplete
  },
  computed: {
    isVisible () {
      return this.search.requests.length > 0
    }
  },
  data () {
    return {
      pattern: '',
      search: this.$store.get('search')
    }
  },
  methods: {
    onSearch (pattern, done) {
      // Perform request for partial match to all registered services
      const requests = this.search.requests.map(request => {
        const service = this.$api.getService(request.service)
        // build the query using given templet if any
        let query = Object.assign({}, request.baseQuery)
        // Then add partial match
        // We don't use set by dot here because Mongo queries on nested fields
        // require the key to contain the path and not nested objects
        //_.set(query, item.field, { $search: pattern })
        query[request.field] = { $search: pattern }
        return service.find({ query })
      })
      Promise.all(requests).then(responses => {
        let results = []
        for (let i = 0; i < responses.length; i++) {
          const response = responses[i]
          const request = this.search.requests[i]
          if (response.total > 0) {
            response.data.forEach(data => {
              let result = {
                label: _.get(data, request.field),
                value: _.get(data, request.field)
              }
              data.service = request.service
              Object.assign(result, { data: data })
              results.push(result)
            })
          }
        }
        done(results)
      })
    },
    onSelected (selection) {
      this.$store.patch('search', { pattern: selection.label, selection: selection.data })
    },
    onChanged (pattern) {
      if (this.$store.get('search.pattern') !== pattern) {
        this.$store.patch('search', { pattern: pattern, selection: null })
      }
    }
  }
}
</script>
