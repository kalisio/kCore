<template>
  <k-modal ref="modal" :toolbar="toolbar" :buttons="buttons">
    <div slot="modal-content" class="column sm-gutter">
      <drop-zone ref="dropZone" id="dropZone" @vdropzone-success="onFileUploaded" @vdropzone-removed-file="onFileRemoved" @vdropzone-sending="onFileSending" :options="dropZoneOptions"/>
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
    options: {
      type: Object,
      default: function () {
        return {
          thumbnailWidth: 150,
          maxFilesize: 0.5
        }
      }
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
    onFileSending (file, xhr, formData) {
      //formData.set('id', `avatars/${this.id}`)
    },
    onFileUploaded (addedFile, response) {
      this.files.push(response)
    },
    onFileRemoved (removedFile, error, xhr) {
      this.files = this.files.filter(file => file._id !== removedFile._id)
    },
    doDone (event, done) {
      this.$emit('file-selection-changed', this.files)
      done()
      this.doClose()
    },
    doClose (event, done) {
      this.$refs.modal.close()
    },
    updateDropZoneOptions () {
      // Setup upload URL, credentials, etc. from input options
      this.dropZoneOptions = Object.assign({}, _.omit(this.options, ['params', 'service']))
      const service = (this.options.service || 'storage')
      this.dropZoneOptions.url = this.$api.getBaseUrl() + this.$config('apiPath', '') + '/' + service
      this.dropZoneOptions.headers = { Authorization: window.localStorage.getItem('feathers-jwt') }
      this.dropZoneOptions.params = Object.assign({}, _.pick(this.options, ['params']))
      // FIXME: work only for avatars right now
      const id = this.$store.get('user._id', '')
      this.dropZoneOptions.params.id = `avatars/${id}`
    },
    open (defaultFiles) {
      // Open the modal
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
