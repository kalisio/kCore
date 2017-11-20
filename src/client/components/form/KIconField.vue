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
      <q-chip :icon="model" closable @close="onSelectIcon" @click="onSelectIcon"/>
    </q-field>
    <k-icon-chooser ref="iconDialog" icon-set="fontawesome" @icon-selected="onIconSelected" />
  </div>
</template>

<script>
import { QField, QChip, QIcon } from 'quasar'
import { KDialog } from '../frame'
import { KIconChooser } from '.'
import mixins from '../../mixins'

export default {
  name: 'k-icon-field',
  components: {
    QField,
    QChip,
    QIcon,
    KDialog,
    KIconChooser
  },
  mixins: [mixins.baseField],
  methods: {
    defaultModel () {
      return 'mode_edit'
    },
    onSelectIcon () {
      this.$refs.iconDialog.open(this.model)
    },
    onIconSelected (icon) {
      this.model = icon
      this.$refs.iconDialog.close()
    }
  }
}
</script>
