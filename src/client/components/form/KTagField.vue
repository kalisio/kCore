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
          <k-autocomplete ref="search" :services="services" :process-results="processResults" @item-selected="onTagAdded" />
        </div>
        <div class="col-7" v-if="tags.length > 0">
          <template v-for="(tag, index) in tags">
            <q-chip
              class="tag-chip"
              :key="tag.value + '-' + index " 
              :icon="tag.icon || 'label'" 
              :color="tag.color || 'faded'" 
              @close="onTagRemoved(tag)" 
              @click="onTagClicked(tag)" 
              closable>
              {{tag.value}}
            </q-chip>
          </template>
        </div>
      </div>
    </q-field>
    <k-icon-chooser ref="iconChooser" icon-set="fontawesome" @choosed="onIconChoosed" />
  </div>
</template>

<script>
import { QField, QChip, QIcon } from 'quasar'
import { KAutocomplete } from '../collection'
import { KIconChooser } from '../input'
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
        iconField: 'icon',
        icon: 'label',
        color: 'dark'
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
          color: 'dark',
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
      this.model = this.tags.map(function (tag) { return _.pick(tag, ['value', 'scope', 'icon', 'color']) })
      this.onChanged()
    },
    onTagClicked (tag) {
      this.selectedTag = tag
      this.$refs.iconChooser.open(tag.icon, tag.color)
    },
    onIconChoosed (icon) {
      this.selectedTag.icon = icon.name
      this.selectedTag.color = icon.color      
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
