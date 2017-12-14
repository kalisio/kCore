<template>
  <q-modal ref="modal" minimized :no-backdrop-dismiss="closable" :no-esc-dismiss="closable" :content-css="{padding: '32px', minWidth: '50vw'}">
    <div class="column">
      <!-- 
        Title section
      -->
      <div class="row justify-between items-center">
        <div class="col-10">
          <h5>{{title}}</h5>
        </div>
        <div class="col-1 self-start">
          <div v-if="closable">
            <q-btn flat round small color="primary" @click="close">
              <q-icon name="close" />
            </q-btn>
          </div>
        </div>
      </div>
      <!-- 
        Content section
       -->
      <div>
        <slot name="dialog-content" /> 
      </div>
      <!--
        Actions section
       -->
      <div style="padding: 8px">
        <slot name="dialog-actions">
          <div class="row justify-end">
            <q-btn v-for="action in actions" @click="$emit('action-triggered', action)" color="primary">{{action}}</q-btn>
          </div>
        </slot>
      </div>
      </div>
    </div>
  </q-modal>
</template>

<script>
import { QModal, QBtn, QIcon } from 'quasar'

export default {
  name: 'k-dialog',
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