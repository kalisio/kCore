<template>
  <q-dialog ref="modal" no-esc-dismiss no-backdrop-dismiss :content-css="options"
           @show="$emit('opened')" @hide="$emit('closed')" :maximized="options.maximized">
    <div class="column">
      <!--
         Toolbar section
       -->
      <div class="row justify-end">
        <template v-for="action in toolbar">
          <q-btn :id="action.name" v-bind:key="action.name" flat round small color="primary" @click="action.handler">
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
              <k-btn :id="button.name" :key="button.name" flat color="primary" @click="button.handler">
                {{button.label}}
              </k-btn>
            </template>
          </div>
        </slot>
      </div>
    </div>
  </q-dialog>
</template>

<script>
import { QDialog, QBtn, QIcon, QTooltip } from 'quasar'
import { KBtn } from '../input'

export default {
  name: 'k-modal',
  components: {
    QDialog,
    QBtn,
    QIcon,
    QTooltip,
    KBtn
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
        return { padding: '4px', minWidth: '50vw' }
      }
    },
    route: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    open () {
      this.$refs.modal.show()
    },
    close (onClose) {
      // FIXME: du to https://github.com/quasarframework/quasar/issues/994
      // we force the toggleInProgress property to false in order to close the modal
      // There is still a bug as it is needed to click twice on close the modal

      // TODO is this still relevant after migration to Quasar v1 ?  What does the "onClose" event do?
      this.$refs.modal.hide(onClose)
      // TODO is this workaround still needed  after migration to Quasar v1 ?
      this.$nextTick(() => {
        this.$refs.modal.toggleInProgress = false
        this.$refs.modal.active = false
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