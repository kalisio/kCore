<template>
  <div class="column justify-center full-width">
    <!--
      Form section
    -->
    <div>
      <k-view ref="view" :schema="schema" @field-changed="onFieldChanged"/>
    </div>
    <!--
      Buttons section
    -->
    <div>
      <div class="row justify-end" style="padding: 12px">
        <q-btn v-if="clearButton !== ''" id="clear-button" color="primary" @click="clear" loader>{{clearButton}}</q-btn>
        <q-btn v-if="resetButton !== ''" id="reset-button" color="primary" @click="reset" loader>{{resetButton}}</q-btn>
        <q-btn v-if="applyButton !== ''" id="apply-button" color="primary" @click="apply" loader>{{applyButton}}</q-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { QBtn } from 'quasar'
import { KView } from '../viewer'
import mixins from '../../mixins'

export default {
  name: 'k-viewer',
  components: {
    QBtn,
    KView
  },
  mixins: [
    mixins.service,
    mixins.objectProxy,
    mixins.schemaProxy,
    mixins.baseEditor(['form']),
    mixins.refsResolver(['form'])
  ],
  watch: {
    '$route' (to, from) {
      // React to route changes but reusing the same component as this one is generic
      this.refresh()
    }
  },
  methods: {
    onFieldChanged (field, value) {
      this.$emit('field-changed', field, value)
    }
  },
  created () {
    this.refresh()
  }
}
</script>
