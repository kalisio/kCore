<template>
  <q-field
    :icon="icon"
    :label="label"
    :label-width="labelWidth"
    :disabled="disabled"
  >
    <q-input
      :id="properties.name + '-field'"
      type="text" 
      v-model="model"
      :readonly="readonly"/>
  </q-field>
  <!--div>
    {{label}} : {{model}}
  </div-->
</template>

<script>
import { QField, QInput } from 'quasar'
import { mixins } from '@kalisio/kdk-core/client'//'../mixins' //

export default {
  name: 'custom-field',
  components: {
    QField,
    QInput
  },
  mixins: [mixins.baseField]
}
</script>
