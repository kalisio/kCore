<template>
    <q-select
      :id="properties.name + '-field'"
      :error-message="errorLabel"
      :error="hasError"
      :disabled="disabled"
      use-chips
      use-input
      multiple
      hide-dropdown-icon
      new-value-mode="add"
      @new-value="createValue"
      @input.native="onInput($event.target.value)"
      @keydown.tab.native="onClick"
      @change="onChanged"
      @blur="onChanged"
      ref="chipsInput"
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
    <!-- Helper -->
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
import mixins from '../../mixins'

export default {
  name: 'k-chips-field',
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
      this.showSendIcon = false
      done(val)
    },
    onInput (val) {
      this.showSendIcon = (val && val.trim().length > 0)
      this.inputValue = val
    },
    onClick (e) {
      this.showSendIcon = false
      this.$refs.chipsInput.add(this.inputValue)
      this.$refs.chipsInput.updateInputValue('')
    }
  }
}
</script>
