<template>
  <div class="column">
    <q-search ref="search" v-model="pattern" />
  </div>
</template>

<script>
import _ from 'lodash'
import { QSearch } from 'quasar'

export default {
  name: 'k-pattern-filter',
  components: {
    QSearch
  },
  props: {
    fields: {
      type: Array,
      default: function () {
        return ['name']
      }
    }
  },
  data () {
    return {
      pattern: ''
    }
  },
  mounted () {
    this.$refs.search.$on('input', () => {
      let fieldQueries = this.fields.map(field => {
        let fieldQuery = {}
        _.set(fieldQuery, field, { $search: this.pattern })
        return fieldQuery
      })
      this.$emit('filter-changed', { $or: fieldQueries })
    })
  }
}
</script>
