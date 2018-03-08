<template>
  <k-modal ref="modal" :toolbar="toolbar" :buttons="buttons">
    <div slot="modal-content" style="max-width: 50vw;">
      <q-carousel arrows dots fullscreen infinite v-if="medias.length > 0" @slide="onViewMedia">
        <div v-for="media in medias" :key="media._id" slot="slide" class="flex-center row">
          <img v-if="media.uri" style="width: auto; height: auto;" :src="media.uri">
          <div v-if="!media.uri">
            <q-spinner-cube size="4em"/>
            <span style="font-size: 2em;">Loading...&nbsp;</span>
          </div>
        </div>
      </q-carousel>
      <div v-if="medias.length === 0" class="text-center"><big>There is nothing to show, please add medias first !</big></div>
    </div>
  </k-modal>
</template>

<script>
import _ from 'lodash'
import { QCarousel, QSpinnerCube } from 'quasar'
import { KModal } from '../frame'

export default {
  name: 'k-media-browser',
  components: {
    QCarousel,
    QSpinnerCube,
    KModal
  },
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
  },
  data () {
    return {
      toolbar: [
        { name: 'Close', icon: 'close', handler: () => this.doClose() }
      ],
      buttons: [],
      medias: []
    }
  },
  methods: {
    hasMedia () {
      return (this.medias.length > 0)
    },
    doClose (event, done) {
      this.$refs.modal.close()
    },
    onViewMedia (index, direction) {
      let media = this.medias[index]
      // Download image the first time
      if (!media.uri) {
        this.$api.getService('storage', this.contextId).get(media._id)
        // Required to use $set when modifying an object inside an array to make it reactive
        .then(data => this.$set(this.medias, index, Object.assign(media, { uri: data.uri })))
      }
    },
    open (medias = []) {
      this.medias = medias
      // Quasar does not send the silde event on first display
      if (this.hasMedia()) this.onViewMedia(0)
      // Then open the modal
      this.$refs.modal.open()
    }
  },
  created () {
  }
}
</script>
