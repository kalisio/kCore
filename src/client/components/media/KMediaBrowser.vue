<template>
  <k-modal ref="modal" :toolbar="toolbar" :buttons="[]" :options="{ 'background-color': '#000000', padding: '0px', maximized: (hasMedia ? true : false) }">
    <div slot="modal-content">
      <q-carousel ref="carousel" class="carousel text-white" actions arrows dots infinite v-show="hasMedia && !zoomedMedia" @slide="onViewMedia">
        <div v-for="media in medias" :key="media._id" slot="slide" class="flex-center row">
          <img v-if="media.uri" style="max-width: 100%; max-height: 100%; object-fit: content;" :src="media.uri" />
          <div v-if="!media.uri">
            <q-spinner-cube size="4em"/>
            <span style="font-size: 2em;">{{ $t('KMediaBrowser.LOADING') }}</span>
          </div>
        </div>
        <div class="toolbar fixed-top-right">
          <q-icon v-if="!currentMediaIsFile" @click="doZoomIn" color="white" name="zoom_in" />
          <q-icon @click="doDownload" color="white" name="cloud_download" />
          <q-icon @click="doClose" color="white" name="close" />
          <a ref="downloadLink" v-show="false" :href="currentDownloadLink" :download="currentName"></a>
        </div>
        <p v-if="currentMediaIsFile" class="fixed-top-left" style="top: 0px">{{currentName}}</p>
      </q-carousel>
      <div class="carousel" v-if="zoomedMedia" >
        <img :src="zoomedMedia.uri" />
        <div class="toolbar fixed-top-right">
        <q-icon @click="doZoomOut" color="white" name="zoom_out" />
        </div>
      </div>
      <div v-show="!hasMedia" class="text-center"><big>{{ $t('KMediaBrowser.NO_MEDIA') }}</big></div>
    </div>
  </k-modal>
</template>

<script>
import 'mime-types-browser'
import { Platform, QCarousel, QSpinnerCube, QIcon, QFixedPosition, QBtn } from 'quasar'
import { KModal } from '../frame'
import mixins from '../../mixins'

export default {
  name: 'k-media-browser',
  components: {
    QCarousel,
    QSpinnerCube,
    QIcon,
    QFixedPosition,
    QBtn,
    KModal
  },
  mixins: [
    mixins.refsResolver(['modal', 'carousel', 'downloadLink'])
  ],
  props: {
    options: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    hasMedia () {
      return (this.medias.length > 0)
    },
    toolbar () {
      return (this.hasMedia ? [] : [{
        name: 'close',
        icon: 'close',
        handler: () => this.close()
      }])
    },
    currentName () {
      return (this.currentMedia ? this.currentMedia.name : '')
    }
  },
  data () {
    return {
      medias: [],
      currentMedia: null,
      currentMediaIsFile: false,
      currentDownloadLink: null,
      zoomedMedia: null
    }
  },
  methods: {
    doClose () {
      this.$refs.carousel.toggleFullscreen()
      this.$refs.modal.close()
    },
    doZoomIn () {
      this.zoomedMedia = this.currentMedia
    },
    doZoomOut () {
      this.zoomedMedia = null
    },
    async doDownload () {
      if (!this.currentMedia) return
      const mimeType = mime.lookup(this.currentMedia.name)
      let uri
      // We already download images for visualization, simply reused data
      if (mimeType.startsWith('image/')) {
        uri = this.currentMedia.uri
      } else {
        // For files we need to download data first
        const data = await this.storageService().get(this.currentMedia._id)
        uri = data.uri
      }
      // Need to convert to blob otherwise some browsers complains when the data uri is too long
      const typeAndData = uri.split(',')
      if (typeAndData.length <= 1) throw Error(this.$t('errors.CANNOT_PROCESS_DOWNLOAD_DATA'))
      const data = atob(typeAndData[1])
      let buffer = new Uint8Array(data.length)
      for (let i = 0; i < buffer.length; i++) {
        buffer[i] = data.charCodeAt(i)
      }
      const blob = new Blob([buffer], { type: mimeType })
      this.currentDownloadLink = URL.createObjectURL(blob)
      if (Platform.is.cordova) {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, (fs) => {
          fs.root.getFile(this.currentMedia.name, { create: true, exclusive: false }, (fileEntry) => {
            fileEntry.createWriter((fileWriter) => {
              fileWriter.write(blob)
              cordova.plugins.fileOpener2.open(fileEntry.nativeURL, mimeType)
            })
          })
        })
      } else {
        // We call Vue.nextTick() to let Vue update its DOM to get the download link ready
        this.$nextTick(() => this.$refs.downloadLink.click())
      }
    },
    async onViewMedia (index, direction) {
      let media = this.medias[index]
      const mimeType = mime.lookup(media.name)
      this.currentMedia = media
      this.currentMediaIsFile = !mimeType.startsWith('image/')
      this.currentDownloadLink = null
      // Download image the first time
      if (!media.uri) {
        // We only download images
        if (mimeType === 'application/pdf') {
          Object.assign(media, { uri: this.$load('pdf-icon.png', 'asset') })
        } else {
          const data = await this.storageService().get(media._id)
          Object.assign(media, { uri: data.uri })
        }
        // Required to use $set when modifying an object inside an array to make it reactive
        this.$set(this.medias, index, media)
      }
    },
    async open (medias = []) {
      this.medias = medias
      this.currentMedia = null
      this.zoomedMedia = null
      await this.loadRefs()
      // Then open the modal
      this.$refs.carousel.toggleFullscreen()
      await this.$refs.modal.open()
      // Quasar does not send the silde event on first display
      if (this.medias.length > 0) {
        this.$refs.carousel.goToSlide(0)
      }
    },
    close (onClose) {
      this.$refs.modal.close(onClose)
    },
    storageService () {
      return this.$api.getService(this.options.service || 'storage')
    }
  },
  created () {
  }
}
</script>

<style>
.carousel {
  background-color: #000000;
}
.toolbar {
  right: 20px;
  font-size: 2rem;
  cursor: pointer;
}
.title {
  left: 20px;
  font-size: 2rem;
}
</style>
