<template>
  <div class="row justify-start sm-gutter full-width">
    <template v-for="(color, index) in colors">
      <div :key="index">
        <q-btn :key="index" :round="shape === 'round'" small :color="color" @click="$emit('input', color)">
        </q-btn>
      </div>
    </template>
  </div>
</template>

<script>
import { QBtn } from 'quasar'

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
      colors: ['dark', 'red', 'pink', 'purple', 'deep-purple', 'indigo', 'blue', 'light-blue', 'cyan', 'teal', 'green', 'light-green', 'lime', 'yellow', 'amber', 'orange', 'deep-orange', 'brown', 'grey', 'blue-grey']
    }
  }
}
</script>
