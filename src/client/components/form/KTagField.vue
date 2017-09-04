<template>
  <q-field
    :icon="icon"
    :label="label"
    :helper="helper"
    :error-label="errorLabel"
    :label-width="labelWidth"
    :error="hasError"
  >
    <div class="row justify-between">
      <k-autocomplete :class="autocompleteSize" @item-selected="onTagAdded" />
      <div class="row col-8" v-if="tags.length > 0">
        <q-chip v-for="tag in tags" :key="tag" icon="tag.icon" color="primary" @close="onTagRemoved(tag)" closable>
          {{ tag.label }}
        </q-chip>
      </div>
    </div>
  </q-field>
</template>

<script>
import { QField, QChip } from 'quasar'
import { KAutocomplete } from '../collection'
import mixins from '../../mixins'

export default {
  name: 'k-tag-field',
  components: {
    QField,
    QChip,
    KAutocomplete
  },
  mixins: [mixins.field],
  computed: {
    autocompleteSize () { 
      return this.tags.length > 0 ? 'col-3' : 'col-12'
    }
  },
  data () {
    return {
      tags: []
    }
  },
  methods: {
    onTagAdded (newTag) {
      if(_.findIndex(this.tags, function(tag) { return tag.label === newTag.label }) === -1) {
        this.tags.push(newTag)
        this.updateModel()
      }
    },
    onTagRemoved (oldTag) {
      this.tags = this.tags.filter(tag => tag.label !== oldTag.label)
      this.updateModel() 
    },
    updateModel () {
      this.model = this.tags
      this.onChanged()
    }
  }
}
</script>
