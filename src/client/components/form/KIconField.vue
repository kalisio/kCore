<template>
  <div>
    <q-field
      :icon="icon"
      :label="label"
      :hint="helper"
      :error-message="errorLabel"
      :label-width="labelWidth"
      :error="hasError"
      :disabled="disabled"
    >
      <q-chip clickable v-ripple text-color="white" :icon="model.name" :color="model.color" @click="onIconClicked"/>
    </q-field>
    <k-icon-chooser 
      :id="properties.name + '-field'"
      ref="iconChooser" 
      @icon-choosed="onIconChoosed" />
  </div>
</template>

<script>
import { QField, QChip, QInput, QIcon } from 'quasar'
import { KIconChooser } from '../input'
import mixins from '../../mixins'

export default {
  name: 'k-icon-field',
  components: {
    QField,
    QChip,
    QInput,
    QIcon,
    KIconChooser
  },
  mixins: [mixins.baseField],
  computed: {
    closable () {
      return !this.properties.required
    }
  },
  methods: {
    emptyModel () {
      return { name: '', color: '' }
    },
    onCloseClicked () {
      this.model = { name: '', color: '' }
    },
    onIconClicked () {
      this.$refs.iconChooser.open(this.model.icon, this.model.color)
    },
    onIconChoosed (icon) {
      this.model = Object.assign({}, icon)
    }
  }
}
</script>
