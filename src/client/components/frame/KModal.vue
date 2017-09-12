<template>
  <q-modal ref="modal" position="bottom" :content-css="{padding: '16px', minWidth: '40vw'}">
    <div class="column justify-center">
      <div v-if="closable" class="self-end">
        <q-btn flat round small color="primary" @click="close">
          <q-icon name="close" />
        </q-btn>
      </div>
      <div>
        <h6>{{title}}</h6>
      </div>
      <div>
        <slot name="modal-content" /> 
      </div>
    </div>
  </q-modal>
</template>

<script>
import { QModal, QBtn, QIcon } from 'quasar'

export default {
  name: 'k-modal',
  components: {
    QModal,
    QBtn,
    QIcon
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    closable: {
      type: Boolean,
      default: true
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