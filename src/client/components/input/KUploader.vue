<template>
  <k-modal ref="modal" :toolbar="toolbar" :buttons="buttons">
    <div slot="modal-content" class="column sm-gutter">
      <drop-zone ref="dropZone" id="dropZone" @vdropzone-file-added="onFileAdded" @vdropzone-success="onFileUploaded" @vdropzone-removed-file="onFileRemoved" @vdropzone-sending="onFileSending" @vdropzone-max-files-exceeded="onMaxFileExceeded" @vdropzone-thumbnail="onThumbnailGenerated" :options="dropZoneOptions"/>
    </div>
  </k-modal>
</template>

<script>
import _ from 'lodash'
import 'vue2-dropzone/dist/vue2Dropzone.css'
import DropZone from 'vue2-dropzone'

export default {
  name: 'k-uploader',
  components: {
    DropZone
  },
  props: {
    contextId: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: ''
    },
    resource: {
      type: String,
      default: ''
    },
    options: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
  },
  data () {
    return {
      dropZoneOptions: {
      },
      toolbar: [
        { name: 'Close', icon: 'close', handler: () => this.doClose() }
      ],
      buttons: [
        { name: 'Done', color: 'primary', handler: (event, done) => this.doDone(event, done) }
      ],
      files: []
    }
  },
  methods: {
    isMultiple () {
      return _.get(this.options, 'multiple', false)
    },
    autoProcessQueue () {
      return _.get(this.options, 'autoProcessQueue', true)
    },
    resourcesService () {
      return _.get(this.options, 'resourcesService', '')
    },
    addFile(addedFile) {
      this.files.push(addedFile)
      this.$emit('file-selection-changed', this.files)
    },
    updateFile(updatedFile) {
      const index = _.findIndex(this.files, file => file.name === updatedFile.name)
      if (index >= 0) {
        this.files[index] = updatedFile
        this.$emit('file-selection-changed', this.files)
      }
    },
    removeFile(removedFile) {
      const index = _.findIndex(this.files, file => file.name === removedFile.name)
      if (index >= 0) {
        // When processing uploads on-the-fly we need to remove from server
        if (this.autoProcessQueue()) {
          this.storageService().remove(this.files[index]._id, {
            query: { resource: this.resource, resourcesService: this.resourcesService() }
          })
          // Thumbnail as well
          this.storageService().remove(this.files[index]._id + '.thumbnail')
        }
        _.pullAt(this.files, index)
        this.$emit('file-selection-changed', this.files)
      }
    },
    onMaxFileExceeded (file) {
      // This is required if we don't want the file to be viewed
      this.dropZone().removeFile(file)
    },
    onThumbnailGenerated (thumbnailFile, dataUrl) {
      const index = _.findIndex(this.files, file => file.name === thumbnailFile.name)
      if (index >= 0) {
        // When processing uploads on-the-fly send thumbnail to the server once computed
        if (this.autoProcessQueue()) {
          const id = this.generateFileId(thumbnailFile)
          this.storageService().create({ id: id + '.thumbnail', uri: dataUrl })
        } else {
          // Store it temporarily
          thumbnailFile.thumbnail = dataUrl
        }
      }
    },
    generateFileId (file) {
      const idTemplate = _.get(this.options, 'storagePath')
      // If a template is given for the storage path use it,
      // otherwise it will be stored at the root level with a generated hash
      if (idTemplate) {
        // Inject useful properties such as current object ID, file, etc.
        let environment = { id: this.id || this.resource, file }
        // The template generates the final ID for the file in storage
        return _.template(idTemplate)(environment)
      } else {
        return this.id || this.resource
      }
    },
    onFileSending (file, xhr, formData) {
      const id = this.generateFileId(file)
      formData.set('id', id)
      // If we attach file to an existing resource add required parameters
      if (this.resource) {
        formData.set('resource', this.resource)
        formData.set('resourcesService', this.resourcesService()) 
      }
      // When not processing uploads on-the-fly send thumbnail to the server along with the file
      this.storageService().create({ id: id + '.thumbnail', uri: file.thumbnail })
    },
    onFileAdded (addedFile) {
      // Filter all internal properties used by drop zone
      this.addFile(_.pick(addedFile, ['name', 'size', '_id']))
    },
    onFileUploaded (addedFile, response) {
      // We update file list on successful upload
      this.updateFile(response)
    },
    onFileRemoved (removedFile, error, xhr) {
      this.removeFile(removedFile)
    },
    doDone (event, done) {
      done()
      this.doClose()
    },
    doClose (event, done) {
      this.$refs.modal.close()
    },
    storageService () {
      return this.$api.getService(this.options.service || 'storage', this.contextId)
    },
    dropZone() {
      // Access vue drop zone
      return this.$refs.dropZone
    },
    dropZoneInstance() {
      // Access underlying dropzone object
      return this.$refs.dropZone.dropzone
    },
    updateDropZoneOptions () {
      // Setup upload URL, credentials, etc. from input options
      this.dropZoneOptions = Object.assign({
        addRemoveLinks: true,
        // FIXME: for now we send files sequentially
        // Indeed when we attach files to a resource as a post process of form submission
        // our backend does not handle multiple files at once
        uploadMultiple: false,
        // Similarly it does not support attaching multiple files to the same resource simultaneously
        parallelUploads: 1,
        params: {
          isArray: this.isMultiple()
        }
      }, _.omit(this.options, ['service', 'storagePath']))
      this.dropZoneOptions.url = this.$api.getBaseUrl() + '/' + this.storageService().path
      // This is used to ensure the request will be authenticated by Feathers
      this.dropZoneOptions.headers = { Authorization: window.localStorage.getItem('feathers-jwt') }
    },
    processQueue () {
      if (this.dropZone().getQueuedFiles().length === 0) {
        return Promise.resolve()
      } else {
        return new Promise((resolve, reject) => {
          // Register to upload complete event
          this.dropZone().$on('vdropzone-queue-complete', () => {
            this.dropZone().$off('vdropzone-queue-complete')
            resolve()
          })
          // Then launch upload
          this.dropZone().processQueue()
        })
      }
    },
    open (defaultFiles = []) {
      // Reset drop zone
      this.files = []
      this.dropZone().removeAllFiles(true)
      // Then setup existing files on server
      defaultFiles.forEach(file => {
        this.dropZoneInstance().emit('addedfile', file)
        // Make sure that there is no progress bar, etc...
        this.dropZoneInstance().emit('complete', file)
        if (file._id) {
          // Download thumbnail
          this.storageService().get(file._id + '.thumbnail')
          .then(image => {
            this.dropZoneInstance().emit('thumbnail', file, image.uri)
          })
        }
      })
      // Because this is dynamic we need to modify the instance as the vue drop zone is not updated automatically
      this.dropZoneInstance().options.maxFiles = 1
      if (this.isMultiple()) {
        // Adjust maxFiles with files already uploaded to get the correct amount
        this.dropZoneInstance().options.maxFiles = _.get(this.options, 'maxFiles', 5) - defaultFiles.length
      }
      // Then open the modal
      this.$refs.modal.open()
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-modal'] = this.$load('frame/KModal')
    this.updateDropZoneOptions()
  }
}
</script>
