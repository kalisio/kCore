<template>
  <div class="content">
    <div v-if="items.length > 0" class="column justify-center">
      <div class="row">
        <template v-for="item in items">
          <component :is="renderer.component" :key="item._id" :item="item" :contextId="contextId" v-bind="renderer.props" />
        </template>
      </div>
      <div class="self-center" v-if="nbPages > 1">
        <q-pagination v-model="currentPage" :max="nbPages" style="padding: 18px" @input="onPageChanged" />
      </div>
    </div>
    <div v-else class="column items-center">
      <div>
        <q-icon size="2rem" name="error_outline" />
      </div>
      <div class="message">
        {{$t('KGrid.EMPTY_GRID')}}
      </div>
    </div>
  </div>
</template>

<script>
import { QIcon, QPagination } from 'quasar'
import mixins from '../../mixins'

export default {
  name: 'k-grid',
  components: {
    QIcon,
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
    },
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
    }
  },
  watch: {
    '$route' (to, from) {
      // React to route changes but reusing the same component as this one is generic
      this.refreshCollection()
    },
    baseQuery: function () {
      this.refreshCollection()
    },
    filterQuery: function () {
      this.refreshCollection()
    }
  },
  methods: {
    getCollectionBaseQuery () {
      return this.baseQuery
    },
    getCollectionFilterQuery () {
      return this.filterQuery
    }
  },
  created () {
    // Load the component
    this.$options.components[this.renderer.component] = this.$load(this.renderer.component)
    this.refreshCollection()
  }
}
</script>

<style>
.content {
  padding: 6px
}
.message {
  font-size: 18px;
  font-weight: 400;
  letter-spacing: normal;
  line-height: 2rem
}
</style>