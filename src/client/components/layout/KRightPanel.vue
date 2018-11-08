<template>
  <div class="row">
    <q-btn id="right-panel-close" flat @click="$emit('right-panel-toggled')">
      <q-icon name="close" />
    </q-btn>
    <k-right-panel-content class="col-12" />
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
  props: {
    content: {
      type: String,
      required: true
    }
  },
  created () {
    this.$options.components['k-right-panel-content'] = this.$load(this.content)
  }
}
</script>
