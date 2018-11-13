<template>
  <div v-if="component!==''" class="row">
    <!--
     Close action
    -->
    <div class="col-12">
      <q-btn id="right-panel-close" flat @click="$emit('right-panel-toggled')">
        <q-icon name="close" />
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
import { QBtn, QIcon } from 'quasar'

export default {
  name: 'k-right-panel',
  components: {
    QBtn,
    QIcon
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
