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
      <k-autocomplete class="col" ref="search" :services="services" :process-results="processResults" @item-selected="onTagAdded" />
      <div class="row col-7" v-if="tags.length > 0">
        <q-chip v-for="tag in tags" :key="tag" icon="label" color="primary" @close="onTagRemoved(tag)" closable>
          {{ tag.value }}
        </q-chip>
      </div>
    </div>
  </q-field>
</template>

<script>
import { QField, QChip, QIcon } from 'quasar'
import { KAutocomplete } from '../collection'
import mixins from '../../mixins'

export default {
  name: 'k-tag-field',
  components: {
    QField,
    QChip,
    QIcon,
    KAutocomplete
  },
  mixins: [mixins.baseField],
  computed: {
    autocompleteSize () { 
      return this.tags.length > 0 ? 'col-5' : 'col-12'
    }
  },
  data () {
    return {
      services: [{
        service: 'tags',
        baseQuery: { scope: this.properties.scope },
        field: 'value',
        icon: 'label'
      }],
      tags: []
    }
  },
  methods: {
    defaultModel () {
      return []
    },
    fill (value) {
      this.model = value
      // Update tags as well
      this.tags = this.model.slice()
    },
    processResults(pattern, results) {
      // We always add first an entry to create a new tag
      if (_.findIndex(results, result => result.value === pattern) === -1) {
        results.unshift({
          label: 'Add "' + pattern + '" tag',
          icon: 'label',
          value: pattern,
          scope: this.properties.scope
        })
      }
    },
    onTagAdded (newTag) {
      if(_.findIndex(this.tags, tag => tag.value === newTag.value) === -1) {
        this.tags.push(newTag)
        this.updateModel()
      }
    },
    onTagRemoved (oldTag) {
      this.tags = this.tags.filter(tag => tag.value !== oldTag.value)
      this.updateModel() 
    },
    updateModel () {
      // filter rendering properties only
      this.model = this.tags.map(function (tag) { return { value: tag.value, scope: tag.scope } })
      this.onChanged()
    }
  }
}
</script>

<style>
.icon {
  cursor: pointer;
  font-size: 24px;
  color: rgba(0, 0, 0, .54);
}
</style>
