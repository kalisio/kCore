<template>
    <q-select
      :id="properties.name + '-field'"
      v-model="model"
      :label="label"
      :error-message="errorLabel"
      :label-width="labelWidth"
      :error="hasError"
      :disabled="disabled"
      use-chips
      use-input
      multiple
      hide-dropdown-icon
      new-value-mode="add"
      @new-value="createValue"
      @input.native="onInput($event.target.value)"
      @change="onChanged"
      @blur="onChanged"
      ref="chipInput"
      no-error-icon
      bottom-slots
    >
    <template v-if="showSendIcon" v-slot:append>
      <q-icon
        color="primary"
        name="send"
        class="cursor-pointer"
        @click="onClick"
      ></q-icon>
    </template>

    <template v-if="helper" v-slot:hint>
      <span v-html="helper"></span>
    </template>
  </q-select>
</template>

<script>
// Stuff below (inputValue, showSendIcon) is meant to show an icon which, when clicked, would add a "chip" value,
// similar to what the "q-chips-input" component from Quasar 0.x offered.
//
// (without this 'icon' the only way to add the chip value is to press the ENTER key)
//
// The approach for adding the icon was taken from: https://codepen.io/smolinari/pen/bJWEaX
// and see also https://github.com/quasarframework/quasar/issues/3866
// and https://forum.quasar-framework.org/topic/3407/q-select-as-chip-input/2
//
// However unfortunately it does not work at the moment - see TODO below.

import { QField, QSelect } from 'quasar'
import mixins from '../../mixins'

export default {
  name: 'k-chips-field',
  components: {
    QField,
    QSelect
  },
  data () {
    return {
      inputValue: '',
      showSendIcon: false
    }
  },
  mixins: [mixins.baseField],
  methods: {
    emptyModel () {
      return []
    },
    createValue (val, done) {
      done(val)
    },
    onInput (val) {
      this.showSendIcon = (val && val.trim().length > 0)
      this.inputValue = val
    },
    onClick (e) {
      // TODO commented this out because it does not work correctly ... so the "send" icon, while
      // looking nice, currently does not do anything when clicked

      // this.showSendIcon = false

      // if (this.inputValue) {
      //   // this.model.push(this.inputValue)
      //   this.$refs.chipInput.add(this.inputValue)
      // }

      // // The following doesn't work, input field doesn't get cleared ... it does work in
      // // the codepen: https://codepen.io/smolinari/pen/bJWEaX so what is the difference, Quasar version?
      // this.inputValue = ''
    }
  }
}
</script>
