<template>
  <div>
    <q-field
      :icon="icon"
      :label="label"
      :helper="helper"
      :error-label="errorLabel"
      :label-width="labelWidth"
      :error="hasError"
    >
      <div class="row justify-between items-center">
        <div class="col-4">
          <k-autocomplete ref="search" :services="services" :process-results="processResults" @changed="onTagAdded" />
        </div>
        <div class="col-7" v-if="tags.length > 0">
          <template v-for="(tag, index) in tags">
            <q-chip
              class="tag-chip"
              :key="tag.value + '-' + index " 
              :icon="tag.icon.name" 
              :color="tag.icon.color" 
              @close="onTagRemoved(tag)" 
              @click="onTagClicked(tag)" 
              closable>
              {{tag.value}}
            </q-chip>
          </template>
        </div>
      </div>
    </q-field>
    <k-icon-chooser ref="iconChooser" @icon-choosed="onIconChoosed" />
  </div>
</template>

<script>
import { QField, QChip, QIcon } from 'quasar'
import { KAutocomplete, KIconChooser } from '../input'
import mixins from '../../mixins'

export default {
  name: 'k-tag-field',
  components: {
    QField,
    QChip,
    QIcon,
    KAutocomplete,
    KIconChooser
  },
  mixins: [mixins.baseField],
  data () {
    return {
      services: [{
        service: 'tags',
        baseQuery: { scope: this.properties.scope },
        field: 'value',
        iconField: 'icon.name',
        icon: { name: 'label', color: 'faded' }
      }],
      tags: []
    }
  },
  methods: {
    emptyModel () {
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
          data: { 
            value: pattern, 
            scope: this.properties.scope, 
            icon: { name: 'label', color: 'dark' }
          }
        })
      }
    },
    onTagAdded (newTag) {
      if (typeof newTag === 'string') return
      if(_.findIndex(this.tags, tag => tag.value === newTag.value) === -1) {
        // Filter the tag data and transform the icon provided by the autocomplete into an icon object
        let tag = _.pick(newTag, ['value', 'scope', 'icon'])
        this.tags.push(tag)
        this.updateModel()
      }
    },
    onTagRemoved (oldTag) {
      this.tags = this.tags.filter(tag => tag.value !== oldTag.value)
      this.updateModel() 
    },
    updateModel () {
      // filter rendering properties only
      this.model = this.tags
      this.onChanged()
    },
    onTagClicked (tag) {
      this.selectedTag = tag
      this.$refs.iconChooser.open(tag.icon)
    },
    onIconChoosed (icon) {
      this.selectedTag.icon = icon
      this.updateModel()
    }
  }
}
</script>

<style>
.tag-chip {
  cursor: pointer;
  margin: 4px;
}
</style>
