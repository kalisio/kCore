<template>
  <div v-if="component!==''" class="row">
    <q-window-resize-observable @resize="onWindowResized" />
    <!--
     Close action
    -->
    <div v-if="closable" class="col-12">
      <q-btn id="right-panel-close" flat color="secondary" @click="$emit('right-panel-toggled')">
        <q-icon name="chevron_right" />
      </q-btn>
    </div>
    <!--
     The child component
    -->
    <div class="col-12">
      <component :is="component" v-bind="content" />
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { QBtn, QIcon, QWindowResizeObservable  } from 'quasar'

export default {
  name: 'k-right-panel',
  components: {
    QBtn,
    QIcon,
    QWindowResizeObservable 
  },
  inject: ['layout'],
  computed: {
    component () {
      if (this.rightPanel.component === '') return ''
      let componentKey = _.kebabCase(this.rightPanel.component)
      this.$options.components[componentKey] = this.$load(this.rightPanel.component)
      return componentKey
    },
    content () {
      return this.rightPanel.content
    }
  },
  data () {
    return {
      closable: false,
      rightPanel: this.$store.get('rightPanel')
    }
  },
  methods: {
    onWindowResized (size) {
      if (size.width > this.layout.$options.propsData.rightBreakpoint) this.closable = true
      else this.closable = false
    }
  }
}
</script>
