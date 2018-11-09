<template>
  <div class="row">
    <div class="col-12">
      <q-btn id="right-panel-close" flat @click="$emit('right-panel-toggled')">
        <q-icon name="close" />
      </q-btn>
    </div>
    <div class="col-12">
      <k-right-panel-content v-bind="options" />
    </div>
  </div>
</template>

<script>
import { QBtn, QIcon } from 'quasar'

export default {
  name: 'k-right-panel',
  components: {
    QBtn,
    QIcon
  },
  watch: {
    content: function () {
      this.$options.components['k-right-panel-content'] = this.$load(this.content)   
    }
  },
  props: {
    content: {
      type: String,
      required: true
    },
    options: {
      type: Array,
      default: () => []
    }
  },
  created () {
    this.$options.components['k-right-panel-content'] = this.$load(this.content)
  }
}
</script>
