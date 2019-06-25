<template>
  <q-list highlight separator v-if="items.length > 0">
    <template v-for="item in items">
      <component :id="item._id" :key="item._id" :item="item" :contextId="contextId" :is="renderer.component" v-bind="renderer.props" @item-selected="onItemSelected(item)"/>
    </template>
    <div class="self-center" v-if="nbPages > 1">
      <q-pagination v-model="currentPage" :max="nbPages" style="padding: 18px" @input="onPageChanged" />
    </div>
  </div>
  </q-list>
  <q-list v-else class="column items-center">
    <div>
      <q-icon size="2rem" name="error_outline" />
    </div>
    <div class="message">
      {{$t('KList.EMPTY_LIST')}}
    </div>
  </q-list>
</template>

<script>
import { QList, QIcon, QPagination, Events } from 'quasar'
import mixins from '../../mixins'

export default {
  name: 'k-list',
  components: {
    QList,
    QIcon,
    QPagination
  },
  mixins: [mixins.service, mixins.baseCollection],
  props: {
    renderer: {
      type: Object,
      default: () => {
        return {
          component: 'collection/KItem',
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
    },
    listStrategy: {
      type: String
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
      return this.filterQuery
    }
  },
  created () {
    // Load the component
    this.$options.components[this.renderer.component] = this.$load(this.renderer.component)
    this.refreshCollection()
    // Whenever the user abilities are updated, update collection as well
    Events.$on('user-abilities-changed', this.refreshCollection)
  },
  beforeDestroy () {
    Events.$off('user-abilities-changed', this.refreshCollection)
  }
}
</script>

<style>
.content {
  padding: 8px
}
.message {
  font-size: 18px;
  font-weight: 400;
  letter-spacing: normal;
  line-height: 2rem
}
</style>