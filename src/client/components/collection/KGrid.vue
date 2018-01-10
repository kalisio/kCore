<template>
  <div class="column justify-center"> 
    <div class="row">
      <template v-for="item in items">
        <component :is="renderer.component" :key="item._id" :item="item" :actions="actions" v-bind="renderer.props" />
      </template>
    </div>
    <div class="self-center" v-if="nbPages > 1">
      <q-pagination v-model="currentPage" :max="nbPages" style="padding: 18px" @input="onPageChanged" />
    </div>
  </div>
</template>

<script>
import { QPagination } from 'quasar'
import mixins from '../../mixins'

export default {
  name: 'k-grid',
  components: {
    QPagination
  },
  mixins: [mixins.service, mixins.baseCollection],
  props: {
    renderer: {
      type: Object,
      default: () => { 
        return { 
          component: 'collection/KCard',
          options: {},
          props: {} 
        } 
      }
    }
  },
  watch: {
    '$route' (to, from) {
      // React to route changes but reusing the same component as this one is generic
      this.refreshCollection()
    }
  },
  created () {
    // Load the component
    this.$options.components[this.renderer.component] = this.$load(this.renderer.component)
    this.refreshCollection()
  }
}
</script>
