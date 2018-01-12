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
      <div class="row justify-between">
        <k-autocomplete class="col" ref="search" :services="services" :process-results="processResults" @item-selected="onTagAdded" />
        <div class="row col-7" v-if="tags.length > 0">
          <q-chip v-for="tag in tags" :icon="tag.icon || 'label'" color="primary" @close="onTagRemoved(tag)" @click="onSelectIcon(tag)" closable>
            {{ tag.value }}
          </q-chip>
        </div>
      </div>
    </q-field>
    <k-icon-chooser ref="iconDialog" icon-set="fontawesome" @icon-selected="onIconSelected" />
  </div>
</template>

<script>
import { QField, QChip, QIcon } from 'quasar'
import { KAutocomplete } from '../collection'
import KIconChooser from './KIconChooser'
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
        iconField: 'icon',
        icon: 'label'
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
      this.model = this.tags.map(function (tag) { return _.pick(tag, ['value', 'scope', 'icon']) })
      this.onChanged()
    },
    onSelectIcon (tag) {
      this.selectedTag = tag
      this.$refs.iconDialog.open(this.selectedTag.icon)
    },
    onIconSelected (icon) {
      this.selectedTag.icon = icon
      this.updateModel()
      this.$refs.iconDialog.close()
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
