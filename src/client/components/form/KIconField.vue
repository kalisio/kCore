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
    <k-dialog ref="iconDialog" title="Select your icon">
      <!-- 
        Content section
       -->
      <div slot="dialog-content" class="row justify-center" style="max-width: 50vw">
        <div v-for="icon in icons" class="col-1">
          <q-icon v-if="icon !== model" :name="icon" size="2rem" @click="onIconSelected(icon)"/>
          <q-icon v-if="icon === model" :name="model" size="2rem" color="primary"/>
        </div>
      </div>
    </k-dialog>
  </div>
</template>

<script>
import { QField, QChip, QIcon } from 'quasar'
import { KDialog } from '../frame'
import mixins from '../../mixins'

export default {
  name: 'k-icon-field',
  components: {
    QField,
    QChip,
    QIcon,
    KDialog
  },
  data () {
    return {
      icons: []
    }
  },
  mixins: [mixins.baseField],
  methods: {
    defaultModel () {
      return 'mode_edit'
    },
    onSelectIcon () {
      this.$refs.iconDialog.open()
    },
    onIconSelected (icon) {
      this.model = icon
      this.$refs.iconDialog.close()
    }
  },
  created () {
    // Fetch available material icons from the google repository so we are always in sync
    fetch('https://raw.githubusercontent.com/google/material-design-icons/master/iconfont/codepoints')
    .then(response => {
      if (response.status !== 200) {
        throw new Error('Impossible to retrieve material icon code points: ' + response.status)
      }
      return response.text()
    })
    .then(text => {
      // We have a list with on each new line 'icon_name icon-code' so we need to filter the codes
      this.icons = text.split(/\s+/).filter((iconName, index) => index % 2 === 0)
    })
  }
}
</script>
