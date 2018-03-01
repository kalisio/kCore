<template>
  <q-field
    :icon="icon"
    :label="label"
    :helper="helper"
    :error-label="errorLabel"
    :label-width="labelWidth"
    :error="hasError"
  >
    <q-chip v-for="file in files" :key="file._id" color="primary" @close="onFileRemoved(file)" closable>
      {{fileName(file)}}
    </q-chip>
    <q-icon v-show="files.length < maxFiles" name="fa-cloud-upload fa-2x" @click="onUpload"/>
    <k-uploader ref="uploader" :id="id" @file-selection-changed="updateFiles" :options="properties.field"/>
  </q-field>
</template>

<script>
import _ from 'lodash'
import { QIcon, QChip, QField } from 'quasar'
import { KUploader } from '../input'
import mixins from '../../mixins'

export default {
  name: 'k-attachment-field',
  components: {
    QIcon,
    QChip,
    QField,
    KUploader
  },
  mixins: [mixins.baseField],
  data () {
    return {
      files: []
    }
  },
  computed: {
    maxFiles () {
      return (this.isMultiple() ? _.get(this.properties, 'maxFiles', 5) : 1)
    }
  },
  methods: {
    isMultiple () {
      return _.get(this.properties, 'field.multiple', false)
    },
    isObject () {
      return (this.properties.type === 'object')
    },
    emptyModel () {
      if (this.isMultiple()) return []
      return (this.isObject() ? {} : '')
    },
    fill (value) {
      this.model = value
      if (this.isMultiple()) {
        this.files = this.model
      } else {
        this.files = (!_.isEmpty(this.model) ? [this.model] : [])
      }
    },
    updateFiles (files) {
      this.files = files
      this.updateModel()
    },
    updateModel () {
      // filter rendering properties only
      if (this.isMultiple()) {
        this.model = this.files
      } else {
        this.model = (this.files.length > 0 ? this.files[0] : {})
      }
      this.onChanged()
    },
    fileName (file) {
      return (file.name ?
              file.name :
              (file._id ? file._id : file))
    },
    onUpload () {
      this.$refs.uploader.open(this.files)
    },
    async onFileRemoved (oldFile) {
      const storage = this.$api.getService(this.properties.service || 'storage')
      await storage.remove(oldFile._id)
      this.updateFiles(this.files.filter(file => file._id !== oldFile._id))
    }
  }
}
</script>
