<template>
  <div>
    <q-field
      :icon="icon"
      :label="label"
      :helper="helper"
      :error-label="errorLabel"
      :label-width="labelWidth"
      :error="hasError"
      :disabled="disabled"
    >
      <div v-if="model.icon !== ''">
        <q-chip :icon="model.name" :color="model.color" :closable="closable && !readonly" @close="onCloseClicked" @click="onIconClicked"/>
      </div>
      <div v-else>
        <q-input @click="onIconClicked" />
      </div>
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
      //You can't change icon in readonly mode
      this.readonly ? false : this.$refs.iconChooser.open(this.model.icon, this.model.color)
    },
    onIconChoosed (icon) {
      this.model = Object.assign({}, icon)
    }
  }
}
</script>
