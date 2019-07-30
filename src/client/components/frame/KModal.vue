<template>
  <q-dialog ref="modal" no-esc-dismiss no-backdrop-dismiss :content-style="options"
           @show="$emit('opened')" @hide="$emit('closed')" :maximized="options.maximized">
    <q-card style="min-width: 50vw;">
      <!--
         Toolbar section
       -->
      <div class="row justify-end">
        <template v-for="action in toolbar">
          <q-btn :id="action.name" v-bind:key="action.name" flat round small @click="action.handler">
            <q-icon :name="action.icon" :color="action.color || 'primary'"/>
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
              <q-btn :id="button.name" :key="button.name" flat color="primary" :label="button.label" @click="button.handler"/>
            </template>
          </div>
        </slot>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import { KBtn } from '../input'

export default {
  name: 'k-modal',
  components: {
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
    close () {
      this.$refs.modal.hide()
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