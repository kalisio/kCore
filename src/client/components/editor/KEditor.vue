<template>
  <div class="column justify-center full-width">
    <!--
      Form section
    -->
    <div>
      <k-form ref="form" :schema="schema" @field-changed="onFieldChanged"/>
    </div>
    <!--
      Buttons section
    -->
    <div>
      <div class="row justify-end" style="padding: 12px">
        <k-btn v-if="clearButton !== ''" id="clear-button" color="primary" @click="clear">{{clearButton}}</k-btn>
        <k-btn v-if="resetButton !== ''" id="reset-button" color="primary" @click="reset">{{resetButton}}</k-btn>
        <k-btn v-if="applyButton !== ''" id="apply-button" color="primary" @click="apply">{{applyButton}}</k-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { KForm } from '../form'
import { KBtn } from '../input'
import mixins from '../../mixins'

export default {
  name: 'k-editor',
  components: {
    KForm,
    KBtn
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
