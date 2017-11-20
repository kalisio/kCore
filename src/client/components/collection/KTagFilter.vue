<template>
  <div>
    <k-autocomplete :services="services" @item-selected="onAddTag" />
    <div v-if="tags.length > 0">
      <q-chip v-for="tag in tags" :key="tag" :icon="tag.icon || 'label'" color="primary" @close="onRemoveTag(tag)" closable>
        {{ tag.value }}
      </q-chip>
    </div>
  </div>
</template>

<script>
import { QChip } from 'quasar'
import KAutocomplete from './KAutocomplete.vue'

export default {
  name: 'k-tag-filter',
  components: {
    QChip,
    KAutocomplete
  },
  props: {
    scope: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      tags: []
    }
  },
  computed: {
    services () {
      return [{service: 'tags',
        baseQuery: { scope: this.scope },
        field: 'value',
        iconField: 'icon',
        icon: 'label'
      }]
    }
  },
  methods: {
    buildQuery () {
      let tagQuery = {}
      if (this.tags.length > 0) {
        tagQuery['tags.value'] = { $in: this.tags.map(tag => tag.value) }
      }
      this.$emit('filter-changed', tagQuery)
    },
    onAddTag (newTag) {
      this.tags.push(newTag)
      this.buildQuery()
    },
    onRemoveTag (oldTag) {
      this.tags = this.tags.filter(tag => tag.value === oldTag)
      this.buildQuery()
    }
  }
}
</script>
