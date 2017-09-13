<template>
  <q-modal ref="modal" position="bottom" :content-css="{padding: '16px', minWidth: '40vw'}">
    <div class="column justify-center">
      <div v-if="closable" class="self-end">
        <q-btn flat round small color="primary" @click="close">
          <q-icon name="close" />
        </q-btn>
      </div>
      <div>
        <h5>{{title}}</h5>
      </div>
      <div>
        <slot name="modal-content" /> 
      </div>
      <div class="self-end" style="padding: 8px">
        <slot name="modal-actions">
          <template v-for="action in actions">
            <q-btn @click="$emit('action-triggered', action)" color="primary">{{action}}</q-btn>
          </template>
        </slot>
      </div>
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
    },
    actions: {
      type: Array,
      default: function () {
        return []
      }
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