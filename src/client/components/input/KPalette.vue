<template>
  <div class="row justify-start sm-gutter full-width">
    <template v-for="(color, index) in colors">
      <div :key="index">
        <q-btn :key="index" :round="shape === 'round'" :icon="value === color ? 'done' : ''" small :color="color" @click="$emit('input', color)">
        </q-btn>
      </div>
    </template>
  </div>
</template>

<script>
import { QBtn } from 'quasar'
import { Colors } from '../../utils'

export default {
  name: 'k-palette',
  components: {
    QBtn
  },
  props: {
    value: {
      type: String,
      default: 'dark'
    },
    shape: {
      type: String,
      default: 'square',
      validator: (value) => {
        return ['round', 'square'].includes(value)
      }
    }
  },
  data () {
    return {
      colors: Object.keys(Colors)
    }
  }
}
</script>
