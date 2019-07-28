<template>
  <div>
    <q-field
      :icon="icon"
      :label="label"
      :error-message="errorLabel"
      :label-width="labelWidth"
      :error="hasError"
      :disabled="disabled"
      no-error-icon
      bottom-slots
    >
      <template v-slot:default>
        <div class="row justify-start items-center">
          <div :class="inputClass">
            <q-input type="text" v-model="input" :after="inputActions" @keyup.enter="onChipAdded()"/>
          </div>
          <div class="col-auto" v-if="chips.length > 0">
            <template v-for="(chip, index) in chips">
              <q-chip
                class="chip"
                :key="chip.value + '-' + index "
                :icon="chip.icon.name"
                :color="chip.icon.color"
                @remove="onChipRemoved(chip)"
                @click="onChipClicked(chip)"
                clickable
                removable
              >
                {{chip.value}}
              </q-chip>
            </template>
          </div>
        </div>
      </template>

      <template v-if="helper" v-slot:hint>
        <span v-html="helper"></span>
      </template>
    </q-field>

    <k-icon-chooser
      :id="properties.name + '-field'"
      ref="iconChooser"
      @icon-choosed="onIconChoosed" />
  </div>
</template>

<script>
import _ from 'lodash'
import { QField, QInput, QChip, QIcon } from 'quasar'
import { KIconChooser } from '../input'
import mixins from '../../mixins'

export default {
  name: 'k-chips-with-icon-field',
  components: {
    QField,
    QInput,
    QChip,
    QIcon,
    KIconChooser
  },
  mixins: [mixins.baseField],
  computed: {
    inputClass () {
      return this.chips.length > 0 ? 'col-auto' : 'col-12'
    },
    inputActions () {
      let actions = []
      if (_.findIndex(this.chips, { 'value': this.input }) === -1) {
        actions.push({
          icon: 'send',
          content: true,
          handler: () => this.onChipAdded()
        })
      }
      actions.push({
        icon: 'cancel',
        content: true,
        handler: () => { this.input = '' }
      })
      return actions
    }
  },
  data () {
    return {
      input: '',
      chips: []
    }
  },
  methods: {
    emptyModel () {
      return []
    },
    fill (value) {
      this.model = value
      this.chips = this.model.slice()
    },
    onChipAdded () {
      let chip = {
        value: this.input,
        icon: {
          name: _.get(this.properties.field, 'icon.name', 'mood'),
          color: _.get(this.properties.field, 'icon.color', 'dark')
        }
      }
      this.chips.push(chip)
      this.input = ''
      this.updateModel()
    },
    onChipRemoved (oldChip) {
      this.chips = this.chips.filter(chip => chip.value !== oldChip.value)
      this.updateModel()
    },
    onChipClicked (chip) {
      this.selectedChip = chip
      this.$refs.iconChooser.open(chip.icon)
    },
    onIconChoosed (icon) {
      this.selectedChip.icon = Object.assign({}, icon)
      this.updateModel()
    },
    updateModel () {
      // filter rendering properties only
      this.model = this.chips
      this.onChanged()
    }
  }
}
</script>

<style>
.chip {
  cursor: pointer;
  margin: 4px;
}
</style>
