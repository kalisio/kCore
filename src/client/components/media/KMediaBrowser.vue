<template>
  <k-modal ref="modal" :toolbar="[]" :buttons="[]" :options="{ padding: '0px', maximized: true }">
    <div slot="modal-content" >
      <q-carousel ref="carousel" actions arrows dots infinite fullscreen v-show="hasMedia && !zoomedMedia" @slide="onViewMedia">
        <div v-for="media in medias" :key="media._id" slot="slide" class="flex-center row">
          <img v-if="media.uri" style="max-width: 100%; max-height: 100%; object-fit: content;" :src="media.uri" />
          <div v-if="!media.uri">
            <q-spinner-cube size="4em"/>
            <span style="font-size: 2em;">Loading...&nbsp;</span>
          </div>
        </div>
        <q-icon slot="action" @click="doClose" class="fixed-top-right" name="close" />
        <q-icon slot="action" @click="doZoomIn" name="zoom_in" />
      </q-carousel>
      <div v-if="zoomedMedia">
        <img :src="zoomedMedia.uri" />
        <q-fixed-position corner="top-right" :offset="[0, -100]">
          <q-btn flat big color="white" @click="doZoomOut" icon="zoom_out" />
        </q-fixed-position>
      </div>
      <div v-show="!hasMedia" class="text-center"><big>There is nothing to show, please add medias first !</big></div>
    </div>
  </k-modal>
</template>

<script>
import { QCarousel, QSpinnerCube, QIcon, QFixedPosition, QBtn } from 'quasar'
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
    mixins.refsResolver(['modal', 'carousel'])
  ],
  props: {
    contextId: {
      type: String,
      default: ''
    },
    options: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    hasMedia () {
      return (this.medias.length > 0)
    }
  },
  data () {
    return {
      medias: [],
      currentMedia: null,
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
    onViewMedia (index, direction) {
      let media = this.medias[index]
      // Download image the first time
      if (!media.uri) {
        this.$api.getService('storage', this.contextId).get(media._id)
        // Required to use $set when modifying an object inside an array to make it reactive
        .then(data => this.$set(this.medias, index, Object.assign(media, { uri: data.uri })))
      }
      this.currentMedia = media
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
    }
  },
  created () {
  }
}
</script>
