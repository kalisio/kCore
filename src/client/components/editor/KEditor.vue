<template>
  <div class="row justify-center full-width">
    <!--
      Form section
    -->
    <k-form class="col-10"
      ref="form"
      :schema="schema"
      @form-ready="onFormReady" />
    <!--
      Buttons section
    -->
    <div class="col-10">
      <div class="row justify-around" style="padding: 18px">
        <q-btn v-if="clearButton !== ''" color="primary" @click="clear">{{ clearButton }}</q-btn>
        <q-btn v-if="resetButton !== ''" color="primary" @click="reset">{{ resetButton }}</q-btn>
        <q-btn v-if="applyButton !== ''" color="primary" @click="apply" loader>{{ applyButton }}</q-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { QBtn } from 'quasar'
import { KForm } from '../form'
import mixins from '../../mixins'

export default {
  name: 'k-editor',
  components: {
    QBtn,
    KForm
  },
  mixins: [
    mixins.service,
    mixins.objectProxy,
    mixins.baseEditor
  ]
}
</script>
