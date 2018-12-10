<template>
  <k-modal ref="modal" :toolbar="getToolbar()" :buttons="getButtons()">
    <div slot="modal-content" class="column sm-gutter">
      <drop-zone ref="dropZone" id="dropZone" @vdropzone-file-added="onFileAdded" @vdropzone-success="onFileUploaded" @vdropzone-removed-file="onFileRemoved" @vdropzone-sending="onFileSending" @vdropzone-thumbnail="onThumbnailGenerated" @vdropzone-error="onError" :options="dropZoneOptions"/>
    </div>
  </k-modal>
</template>

<script>
import _ from 'lodash'
import 'vue2-dropzone/dist/vue2Dropzone.css'
import DropZone from 'vue2-dropzone'
import { Events } from 'quasar'

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
    objectId: {
      type: String,
      default: ''
    },
    resource: {
      type: String,
      default: ''
    },
    baseQuery: {
      type: Object,
      default: () => {}
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
      files: []
    }
  },
  methods: {
    getToolbar () {
      return [
        { name: 'close-action', label: this.$t('KUploader.CLOSE_ACTION'), icon: 'close', handler: () => this.doClose() }
      ]
    },
    getButtons () {
      return [
        { name: 'done-button', label: this.$t('KUploader.DONE_BUTTON'), color: 'primary', handler: (event, done) => this.doDone(event, done) }
      ]
    },
    isMultiple () {
      return _.get(this.options, 'multiple', false)
    },
    autoProcessQueue () {
      return _.get(this.options, 'autoProcessQueue', true)
    },
    resourcesService () {
      return _.get(this.options, 'resourcesService', '')
    },
    addFile (addedFile) {
      this.files.push(addedFile)
      this.$emit('file-selection-changed', this.files)
    },
    updateFile (updatedFile) {
      const index = _.findIndex(this.files, file => file.name === updatedFile.name)
      if (index >= 0) {
        this.files[index] = updatedFile
        this.$emit('file-selection-changed', this.files)
      }
    },
    removeFile (removedFile) {
      const index = _.findIndex(this.files, file => file.name === removedFile.name)
      if (index >= 0) {
        // When processing uploads on-the-fly we need to remove from server
        if (this.autoProcessQueue()) {
          // Possible on max files exceeded
          if (removedFile.status !== 'error') {
            this.storageService().remove(this.files[index]._id, {
              query: Object.assign({ resource: this.resource, resourcesService: this.resourcesService() }, this.baseQuery)
            })
            // Thumbnail as well
            this.storageService().remove(this.files[index]._id + '.thumbnail')
          }
        }
        _.pullAt(this.files, index)
        this.$emit('file-selection-changed', this.files)
      }
    },
    onThumbnailGenerated (thumbnailFile, dataUrl) {
      const index = _.findIndex(this.files, file => file.name === thumbnailFile.name)
      if (index >= 0) {
        const id = this.generateFileId(thumbnailFile)
        // When processing uploads on-the-fly send thumbnail to the server once computed
        if (this.autoProcessQueue()) {
          this.storageService().create({ id: id + '.thumbnail', uri: dataUrl })
        } else {
          // Check if the file has already been uploaded because it is an asynchronous process
          // that might happen before the thumbnail has been generated
          if (thumbnailFile._id) {
            this.storageService().create({ id: id + '.thumbnail', uri: dataUrl })
          } else {
            // Otherwise store it temporarily until the file is uploaded
            thumbnailFile.thumbnail = dataUrl
          }
        }
      }
    },
    generateFileId (file) {
      const idTemplate = _.get(this.options, 'storagePath')
      // If a template is given for the storage path use it,
      // otherwise it will be stored at the root level with a generated hash
      if (idTemplate) {
        // Inject useful properties such as current object ID, file, etc.
        let environment = { id: this.objectId || this.resource, file }
        // The template generates the final ID for the file in storage
        return _.template(idTemplate)(environment)
      } else {
        return this.objectId || this.resource
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
      _.forOwn(this.baseQuery, (value, key) => {
        formData.set(key, value)
      })
      // When not processing uploads on-the-fly send thumbnail to the server along with the file
      // Check if it does exist however because it is processed asynchronously
      if (file.thumbnail) {
        this.storageService().create({ id: id + '.thumbnail', uri: file.thumbnail })
      }
    },
    onFileAdded (addedFile) {
      // Filter all internal properties used by drop zone
      this.addFile(_.pick(addedFile, ['name', 'size', '_id']))
      // Keep track of previews for cleanup
      this.previews.push(addedFile.previewElement)
    },
    onFileUploaded (addedFile, response) {
      // We update file list on successful upload
      this.updateFile(response)
    },
    onFileRemoved (removedFile, error, xhr) {
      this.removeFile(removedFile)
    },
    onError (file, error, xhr) {
      // This is required if we don't want the file to be viewed
      this.dropZone().removeFile(file)
      // The error message is already translated using the DropZone dictionary
      Events.$emit('error', { message: error })
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
    dropZone () {
      // Access vue drop zone
      return this.$refs.dropZone
    },
    dropZoneInstance () {
      // Access underlying dropzone object
      return this.$refs.dropZone.dropzone
    },
    async updateDropZoneOptions () {
      const accessToken = await this.$api.passport.getJWT()
      const options = _.omit(this.options, ['service', 'storagePath'])
      // We change interpolation tags to avoid interpolation by i18n next since drop zone will do it
      const dictionary = this.$t('KUploader.dropZone', { returnObjects: true, interpolation: { prefix: '[[', suffix: '[[' } })
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
        },
        // Uploading can require a long time
        timeout: 60 * 60 * 1000 // 1h should be sufficient since we also have size limits
      }, options, dictionary)
      this.dropZoneOptions.url = this.$api.getBaseUrl() + '/' + this.storageService().path
      // This is used to ensure the request will be authenticated by Feathers
      this.dropZoneOptions.headers = { Authorization: accessToken }
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
    clearPreviews () {
      this.previews.forEach(preview => {
        // Code taken from removedfile method of DropZone.js
        if (preview.parentNode) {
          preview.parentNode.removeChild(preview)
        }
      })
      this.previews = []
    },
    clearFiles () {
      this.files = []
      // Reset drop zone
      this.dropZone().removeAllFiles(true)
    },
    clear () {
      // FIXME: for now we need to remove previous preview elements manually
      // Indeed the previous method does not seem to work for this
      this.clearPreviews()
      this.clearFiles()
    },
    open (defaultFiles = []) {
      this.clear()
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
    // Initialize private properties
    this.previews = []
    // Load the required components
    this.$options.components['k-modal'] = this.$load('frame/KModal')
    this.updateDropZoneOptions()
  },
  beforeDestroy () {
    // Without this the lastest uploaded files remain active in drop zone
    // causing the file removed event to be trigerred
    this.clear()
  }
}
</script>
