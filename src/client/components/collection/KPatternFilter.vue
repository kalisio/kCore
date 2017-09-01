<template>
  <div class="column justify-center gutter">
    <q-search ref="search" v-model="pattern" style="padding: 18px"/>
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
  data () {
    return {
      pattern: ''
    }
  },
  mounted () {
    // FIXME: to be read in config
    this.fields = ['name', 'email']
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
