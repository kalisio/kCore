<template>
  <q-modal ref="modal" no-esc-dismiss no-backdrop-dismiss :content-css="options">
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
      <div class="row justify-between items-center" style="margin-left: 24px">
        <div>
          <h5>{{title}}</h5>
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
      default: () => []
    },
    buttons: {
      type: Array,
      default: () => []
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
      this.$refs.modal.open()
    },
    close (onClose) {
      this.$refs.modal.close(onClose)
    }
  },
  mounted () {
    if (this.route) this.open()
  }
}
</script>