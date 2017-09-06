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
      <k-autocomplete ref="search" :class="autocompleteSize" @item-selected="onTagAdded" />
      <q-icon class="icon col-1" name="add" color="primary" @click="onCreateTag"/>
      <div class="row col-7" v-if="tags.length > 0">
        <q-chip v-for="tag in tags" :key="tag" icon="label" color="primary" @close="onTagRemoved(tag)" closable>
          {{ tag.label }}
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
      return this.tags.length > 0 ? 'col-4' : 'col-11'
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
    onCreateTag () {
      const newTag = { label: this.$refs.search.selection, icon: '' }
      if(_.findIndex(this.tags, function(tag) { return tag.label === newTag.label }) === -1) {
        this.tags.push(newTag)
        this.updateModel()
      }
    },
    updateModel () {
      this.model = this.tags
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
