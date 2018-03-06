<template>
  <k-modal ref="modal" :toolbar="toolbar" :buttons="buttons">
    <div slot="modal-content" class="column sm-gutter">
      <drop-zone ref="dropZone" id="dropZone" @vdropzone-file-added="onFileAdded" @vdropzone-success="onFileUploaded" @vdropzone-removed-file="onFileRemoved" @vdropzone-sending="onFileSending" @vdropzone-max-files-exceeded="onMaxFileExceeded" :options="dropZoneOptions"/>
      <!--vue-dropzone ref="myVueDropzone" id="dropzone" @vdropzone-file-added="vfileAdded" @vdropzone-success="vsuccess" @vdropzone-error="verror" @vdropzone-removed-file="vremoved" @vdropzone-sending="vsending" @vdropzone-success-multiple="vsuccessMuliple" @vdropzone-sending-multiple="vsendingMuliple" @vdropzone-queue-complete="vqueueComplete" @vdropzone-total-upload-progress="vprogress" @vdropzone-mounted="vmounted" @vdropzone-drop="vddrop" @vdropzone-drag-start="vdstart" @vdropzone-drag-end="vdend" @vdropzone-drag-enter="vdenter" @vdropzone-drag-over="vdover" @vdropzone-drag-leave="vdleave" :options="dropzoneOptions"-->
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
    async removeFile(removedFile) {
      const index = _.findIndex(this.files, file => file.name === removedFile.name)
      if (index >= 0) {
        // When processing uploads we need to remove from server first
        if (this.autoProcessQueue()) {
          await this.storageService().remove(this.files[index]._id, {
            query: { resource: this.resource, resourcesService: this.resourcesService() }
          })
        }
        _.pullAt(this.files, index)
        this.$emit('file-selection-changed', this.files)
      }
    },
    onMaxFileExceeded (file) {
      // This is required if we don't want the file to be viewed
      this.dropZone().removeFile(file)
    },
    onFileSending (file, xhr, formData) {
      const idTemplate = _.get(this.options, 'storagePath')
      // If a template is given for the storage path use it,
      // otherwise it will be stored at the root level with a generated hash
      if (idTemplate) {
        // Inject useful properties such as current object ID, file, etc.
        let environment = { id: this.id || this.resource, file }
        // The template generates the final ID for the file in storage
        const id = _.template(idTemplate)(environment)
        formData.set('id', id)
      }
      // If we attach file to an existing resource add required parameters
      if (this.resource) {
        formData.set('resource', this.resource)
        formData.set('resourcesService', this.resourcesService()) 
      }
    },
    onFileAdded (addedFile) {
      // Filter all internal properties used by drop zone
      this.addFile(_.pick(addedFile, ['name', 'size', '_id']))
    },
    onFileUploaded (addedFile, response) {
      // We update file list on successful upload,
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
      return this.$api.getService(this.options.service || 'storage')
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
        // FIXME: we should only download a thumbnail here
        if (file._id) {
          this.storageService().get(file._id)
          .then(image => this.dropZoneInstance().emit('thumbnail', file, image.uri))
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
