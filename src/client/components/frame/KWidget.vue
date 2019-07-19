<template>
  <q-page-sticky :position="currentCorner" :offset="currentOffset">
    <q-menu
      ref="popover" @show="onOpen" @hide="onClose"
      :anchor-click="false"
      anchor="center middle"
      :self="currentSelf"
      max-height="100%"
      :style="currentCss"
      persistent
    >
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
          <slot name="widget-content" />
        </div>
    </q-menu>
  </q-page-sticky>
</template>

<script>
import _ from 'lodash'
import { QMenu, QPageSticky, QBtn, QIcon, QTooltip } from 'quasar'

export default {
  name: 'k-k-widget',
  components: {
    QMenu,
    QPageSticky,
    QBtn,
    QIcon,
    QTooltip
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    corner: {
      type: Object,
      default: () => {
        return {
          minimized: 'top-left',
          maximized: 'top-left'
        }
      }
    },
    offset: {
      type: Object,
      default: () => {
        return {
          minimized: [0, 0],
          maximized: [0, 0]
        }
      }
    },
    css: {
      type: Object,
      default: () => {
        return {
          minimized: 'width:40vw',
          maximized: 'width:100vw;height:100vh'
        }
      }
    }
  },
  computed: {
    currentCorner () {
      return this.corner[this.mode]
    },
    currentOffset () {
      return this.offset[this.mode]
    },
    currentCss () {
      return this.css[this.mode]
    },
    currentSelf () {
      return _.replace(this.corner[this.mode], '-', ' ')
    },
    toolbar () {
      return [
        {
          name: 'change-mode',
          label: this.$t(this.mode === 'minimized' ? 'KWidget.MINIMIZE_ACTION' : 'KWidget.MAXIMIZE_ACTION'),
          icon: this.mode === 'minimized' ? 'fullscreen' : 'fullscreen_exit',
          handler: () => this.toggleMode()
        },
        {
          name: 'close-action',
          label: this.$t('KWidget.CLOSE_ACTION'),
          icon: 'close',
          handler: () => this.close()
        }
      ]
    }
  },
  data () {
    return {
      mode: 'minimized',
      isOpened: false
    }
  },
  methods: {
    async setMode (mode) {
      this.mode = mode
      window.dispatchEvent(new Event('resize'))
      // We need to force a refresh so that the style is correctly updated by Vuejs
      await this.$nextTick()
      this.$emit('state-changed', this.mode)
    },
    async toggleMode () {
      await this.setMode(this.mode === 'minimized' ? 'maximized' : 'minimized')
    },
    open (fn) {
      this.$refs.popover.show(fn)
    },
    close (fn) {
      this.$refs.popover.hide(fn)
    },
    toggle (onClose) {
      if (!this.isOpened) {
        this.open()
      } else {
        this.close(onClose)
      }
    },
    isOpen () {
      return this.isOpened
    },
    onOpen () {
      this.$emit('state-changed', this.mode)
    },
    onClose () {
      this.$emit('state-changed', 'closed')
    }
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
