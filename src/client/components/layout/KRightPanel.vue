<template>
  <div v-if="component!==''" class="col">
    <!--
     Close action
    -->
    <div v-if="closable" class="row justify-start">
      <q-btn id="right-panel-close" flat color="secondary" @click="$emit('right-panel-toggled')">
        <q-icon name="chevron_right" />
      </q-btn>
    </div>
    <!--
     The child component
    -->
    <div class="row">
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
