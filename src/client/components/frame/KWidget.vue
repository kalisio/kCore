<template>
  <div v-show="isOpened" :style="css" class="k-widget q-pa-md">
    <div class="row">
      <!--
        Title section
      -->
      <div class="col-8 text-h5">
        {{title}}
      </div>
      <!--
       Toolbar section
      -->
      <div class="col-4 text-right">
        <template v-for="action in toolbar">
          <q-btn :id="action.name" v-bind:key="action.name" flat round small color="primary" @click="action.handler">
            <q-icon :name="action.icon" />
            <q-tooltip v-if="action.label">{{action.label}}</q-tooltip>
          </q-btn>
        </template>
      </div>
    </div>
    <!--
      Content section
    -->
    <slot name="widget-content" />
  </div>
</template>

<script>
export default {
  name: 'k-widget',
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  computed: {
    css () {
      if (this.mode === 'maximized') return 'width: 100vw;'
      if (this.$q.screen.lt.sm) return 'width: 100vw;'
      if (this.$q.screen.lt.md) return 'width: 90vw;'
      if (this.$q.screen.lt.lg) return 'width: 80vw;'
      return 'width: 60vw;'
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
      this.$emit('state-changed', this.mode)
    },
    async toggleMode () {
      await this.setMode(this.mode === 'minimized' ? 'maximized' : 'minimized')
    },
    open () {
      this.isOpened = true
      this.$emit('state-changed', this.mode)
    },
    close () {
      this.isOpened = false
      this.$emit('state-changed', 'closed')
    },
    toggle () {
      if (!this.isOpened) {
        this.open()
      } else {
        this.close()
      }
    },
    isOpen () {
      return this.isOpened
    }
  }
}
</script>

<style lang="stylus">
.k-widget
  border: solid 1px lightgrey;
  border-radius: 8px;
  background: #ffffff

.k-widget:hover
  border: solid 1px $primary;
</style>