<template>
  <div>
    <q-input 
      v-model="fileName" 
      type="file" 
      :attributes="{id: 'input'}" 
      v-bind="$attrs"
      @change="onChanged" />
  </div>
</template>

<script>
import { QInput } from 'quasar'

export default {
  name: 'k-input-file',
  components: {
    QInput
  },
  props: {
    mimeTypes: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      fileName: ''
    }
  },
  methods: {
    onChanged (newFileName) {
      if (newFileName === '') {
        this.$emit('cleared')
      } else {
        let file = document.getElementById('input').files[0]
        if (!this.mimeTypes.includes(file.type)) this.$emit('rejected')
        else {
          let reader = new FileReader()
          reader.addEventListener('loadend', () => this.$emit('loaded', reader.result))
          reader.addEventListener('error', () => this.$emit('failed'))
          reader.readAsText(file)
        }
      }
    }
  }
}
</script>
