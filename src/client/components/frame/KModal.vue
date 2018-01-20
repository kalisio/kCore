<template>
  <q-modal ref="modal" no-esc-dismiss no-backdrop-dismiss :content-css="options" @open="$emit('opened')" @close="$emit('closed')">
    <div class="column">
      <!-- 
         Toolbar section
       -->
      <div class="row justify-end">
        <template v-for="action in toolbar">
          <q-btn v-bind:key="action.name" flat round small color="primary" @click="action.handler">
            <q-icon :name="action.icon" />
            <q-tooltip v-if="action.label">{{action.label}}</q-tooltip>
          </q-btn>
        </template>
      </div>
      <!-- 
        Title section
      -->
      <div class="row justify-start" style="margin-left: 18px">
        <div class="modal-title">
          {{title}}
        </div>
      </div>
      <!-- 
        Content section
       -->
      <div style="padding: 16px">
        <slot name="modal-content" /> 
      </div>
      <!--
        Buttons section
       -->
      <div style="padding: 16px">
        <slot name="dialog-actions">
          <div class="row justify-end">
            <template v-for="button in buttons">
              <q-btn v-bind:key="button.name" loader flat color="primary" @click="button.handler">
                {{button.name}}
              </q-btn>
            </template>
          </div>
        </slot>
      </div>
    </div>
  </q-modal>
</template>

<script>
import _ from 'lodash'
import { QModal, QBtn, QIcon, QTooltip } from 'quasar'

export default {
  name: 'k-modal',
  components: {
    QModal,
    QBtn,
    QIcon,
    QTooltip
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    toolbar: {
      type: Array,
      default: () => { return [] }
    },
    buttons: {
      type: Array,
      default: () => { return [] }
    },
    options: {
      type: Object,
      default: () => {
        return { padding: '4px', minWidth: '50vw', maxWidth: '80vw' }
      }
    },
    route: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    open () {
      this.$refs.modal.open()
    },
    close (onClose) {
      // FIXME: du to https://github.com/quasarframework/quasar/issues/994 
      // we force the toggleInProgress property to false in order to close the modal
      // There is still a bug as it is needed to click twice on close the modal
      this.$refs.modal.close(onClose)
      this.$nextTick(() => {
        this.$refs.modal.toggleInProgress = false
      })
    }
  },
  mounted () {
    if (this.route) this.open()
  }
}
</script>

<style>
.modal-title {
  font-size: 18px;
  font-weight: 400;
  letter-spacing: normal;
  line-height: 2rem
}
</style>