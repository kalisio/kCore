<template>
  <div>
    <q-field
      :icon="icon"
      :label="label"
      :hint="helper"
      :error-message="errorLabel"
      :label-width="labelWidth"
      :error="hasError"
      :disabled="disabled"
      no-error-icon
      bottom-slots
    >
      <div class="row justify-between items-center">
        <div class="col-4">
          <k-autocomplete 
            :id="properties.name + '-field'" 
            ref="search" 
            :services="services" 
            :process-results="processResults" 
            @changed="onTagAdded" />
        </div>
        <div class="col-7" v-if="tags.length > 0">
          <template v-for="(tag, index) in tags">
            <q-chip
              text-color="white"
              :key="tag.value + '-' + index " 
              :icon="tag.icon.name" 
              :color="tag.icon.color"
              :label="tag.value"
              @remove="onTagRemoved(tag)" 
              @click="onTagClicked(tag)"
              removable clickable/>
          </template>
        </div>
      </div>
    </q-field>
    <k-icon-chooser 
      ref="iconChooser" 
      @icon-choosed="onIconChoosed" />
  </div>
</template>

<script>
import _ from 'lodash'
import { QField, QChip, QIcon } from 'quasar'
import { Store } from '../../store'
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
      // Update tags as well but only those of current context as tag service can be contextual
      const context = Store.get('context')
      this.partition = _.partition(this.model, { context: _.get(context, '_id') })
      this.tags = this.partition[0]
    },
    processResults (pattern, results) {
      // We always add first an entry to create a new tag
      if (_.findIndex(results, result => result.value === pattern) === -1) {
        results.unshift({
          label: this.$t('KTagField.ADD_TAG', { tag: pattern }),
          icon: 'send',
          value: pattern,
          data: {
            value: pattern,
            scope: this.properties.scope,
            icon: { name: '', color: 'dark' }
          }
        })
      }
    },
    onTagAdded (newTag) {
      if (typeof newTag === 'string') return
      if (_.findIndex(this.tags, tag => tag.value === newTag.value) === -1) {
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
      this.model = _.concat(this.tags, this.partition[1])
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
