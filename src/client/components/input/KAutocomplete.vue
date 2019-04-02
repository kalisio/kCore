<template>
  <!-- TODO Quasar v1 migration --><div>TODO TEMP REMOVE ME</div>
  <!-- <q-search v-model="pattern" @change="onChanged" :placeholder="$t('KAutocomplete.PLACEHOLDER')">
    <q-autocomplete @search="onSearch" @selected="onSelected" />
  </q-search> -->
</template>

<script>
import _ from 'lodash'
// TODO Quasar v1 migration
// import { QSearch, QAutocomplete } from 'quasar'

export default {
  name: 'k-autocomplete',
  components: {
// TODO Quasar v1 migration
    // QSearch,
    // QAutocomplete
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
      pattern: ''
    }
  },
  methods: {
    clear () {
      this.pattern = ''
    },
    onSearch (pattern, done) {
      // Perform request for partial match to all registered services
      const requests = this.services.map(item => {
        const service = this.$api.getService(item.service)
        // build the query using given templet if any
        let query = Object.assign({}, item.baseQuery)
        // Then add partial match
        // We don't use set by dot here because Mongo queries on nested fields
        // require the key to contain the path and not nested objects
        // _.set(query, item.field, { $search: pattern })

        query[item.field] = { $search: pattern }
        return service.find({ query })
      })
      Promise.all(requests).then(responses => {
        let results = []
        for (let i = 0; i < responses.length; i++) {
          const response = responses[i]
          const item = this.services[i]
          if (response.total > 0) {
            response.data.forEach(data => {
              data.service = item.service
              data.field = item.field
              data.limit = item.limit
              if (!data.icon) data.icon = item.icon
              let result = {
                label: _.get(data, item.field),
                value: _.get(data, item.field),
                icon: _.get(data, item.iconField || 'icon.name')
              }
              if (item.subfield) {
                data.subfield = item.subfield
                result.sublabel = _.get(data, item.subfield)
              }
              Object.assign(result, { data: data })
              results.push(result)
            })
          }
        }
        if (this.processResults) {
          this.processResults(pattern, results)
        }
        this.$emit('pattern-changed', pattern)
        done(results)
      })
    },
    onSelected (item) {
      this.emitChange(item.data)
    },
    onChanged (pattern) {
      this.emitChange(pattern)
    }
  },
  created () {
    this.emitChange = _.debounce((value) => { this.$emit('changed', value) }, 300)
  }
}
</script>
