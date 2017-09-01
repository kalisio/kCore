<template>
  <div>
    <q-chip v-for="tag in tags" :key="tag" icon="tag.icon" color="primary" @close="onRemoveTag" closable>
      {{ tag.label }}
    </q-chip>
    <k-autocomplete @item-selected="onAddTag" />
  </div>
</template>

<script>
import { QChip } from 'quasar'
import { KAutocomplete } from '.'

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
  mounted () {
  }
}
</script>
