<template>
  <div v-if="component!==''" class="row">
    <!--
     Close action
    -->
    <div v-if="closable" class="col-12">
      <q-btn id="right-panel-close" flat color="secondary" @click="klayout.hideRightDrawer()">
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

export default {
  name: 'k-right-panel',
  inject: ['klayout'],
  props: {
    closable: {
      type: Boolean,
      required: true
    }
  },
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
      rightPanel: this.$store.get('rightPanel')
    }
  }
}
</script>
