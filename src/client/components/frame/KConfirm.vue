<template>
  <k-modal ref="modal" :title="title">
    <!-- 
      Content section
     -->
    <div slot="modal-content">
      <div v-html="content" />
      <div v-if="prevent">
        <q-input v-model="capturedText" :float-label="prevent.label" />
      </div>
    </div>
    <!--
      Actions section
     -->
    <div slot="modal-actions">
      <q-btn @click="$emit('confirmed')" :disable="capturedText !== prevent.capture" color="primary">{{action}}</q-btn>
    </div>
  </k-modal>
</template>

<script>
import { QInput, QBtn } from 'quasar'
import KModal from './KModal.vue'

export default {
  name: 'k-confirm',
  components: {
    QInput,
    QBtn,
    KModal
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    },
    action: {
      type: String,
      default: 'Ok'
    },
    prevent: {
      type: Object,
      default: function () {
        return null
      }
    }
  },
  data () {
    return {
      capturedText: ''
    }
  },
  methods: {
    open () {
      this.$refs.modal.open()
    },
    close () {
      this.$refs.modal.close()
    }
  }
}
</script>