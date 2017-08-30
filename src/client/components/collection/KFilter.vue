<template>
  <div class="column justify-center gutter">
    <div>
      <q-search ref="search" v-model="pattern" style="padding: 18px"></q-search>
    </div>
  </div>
</template>

<script>
import { QSearch } from 'quasar'

export default {
  name: 'k-filter',
  components: {
    QSearch
  },
  data () {
    return {
      pattern: ''
    }
  },
  mounted () {
    this.$refs.search.$on('input', () => {
      this.$emit('filter-changed', { name: { $search: this.pattern } })
    })
  }
}
</script>
