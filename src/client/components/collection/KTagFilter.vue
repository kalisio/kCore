<template>
  <div>
    <k-autocomplete :services="services" @item-selected="onAddTag" />
    <div v-if="tags.length > 0">
      <q-chip v-for="tag in tags" :key="tag" icon="label" color="primary" @close="onRemoveTag(tag)" closable>
        {{ tag.label }}
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
  data () {
    return {
      tags: []
    }
  },
  methods: {
    buildQuery () {
      let tagQuery = {}
      if (this.tags.length > 0) {
        tagQuery['tags.value'] = { $in: this.tags.map(tag => tag.label) }
      }
      this.$emit('filter-changed', tagQuery)
    },
    onAddTag (newTag) {
      this.tags.push(newTag)
      this.buildQuery()
    },
    onRemoveTag (oldTag) {
      this.tags = this.tags.filter(tag => tag.label === oldTag)
      this.buildQuery()
    }
  },
  created () {
    this.services = [{
      service: 'tags',
      baseQuery: { scope: 'skill' },
      field: 'value',
      icon: 'tag'
    }]
  }
}
</script>
