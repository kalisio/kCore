<template>
  <div>
    <q-field
      :icon="icon"
      :label="label"
      :helper="helper"
      :error-label="errorLabel"
      :label-width="labelWidth"
      :error="hasError"
    >
      <div v-if="model.icon !== ''">
        <q-chip :icon="model.icon" :color="model.color" :closable="closable" @close="onCloseClicked" @click="onIconClicked"/>
      </div>
      <div v-else>
        <q-input @click="onIconClicked" />
      </div>
    </q-field>
    <k-icon-chooser ref="iconChooser" icon-set="fontawesome" @icon-choosed="onIconChoosed" />
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
      return ! this.properties.required
    }
  },
  methods: {
    emptyModel () {
      return { icon: '', color: '' }
    },
    onCloseClicked () {
      this.model = { icon: '', color: '' }
    },
    onIconClicked () {
      this.$refs.iconChooser.open(this.model.icon, this.model.color)
    },
    onIconChoosed (icon) {
      this.model['icon'] = icon.name
      this.model['color'] = icon.color
    }
  }
}
</script>
