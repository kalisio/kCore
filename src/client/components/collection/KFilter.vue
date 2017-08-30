<template>
  <div class="column justify-center gutter">
    <div>
      <q-search ref="search" v-model="search" style="padding: 18px"></q-search>
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
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      search: ''
    }
  },
  mounted () {
    this.$refs.search.$on('input', () => {
      // Never mutate the prop directly
      // See: https://github.com/vuejs/vue/issues/4373
      var filter = Object.assign({}, this.value)
      filter.name = this.search
      this.$emit('input', filter)
      this.$emit('filter-changed', filter)
    })
  }
}
</script>
