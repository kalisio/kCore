<template>
  <div class="column">
    <!--
      Fields section
    -->
    <k-field-group ref="fields" @field-group-ready="onFieldGroupReady" :schema="schema" />
    <!--
      Buttons section
    -->
    <div class="row justify-around" style="padding: 18px">
      <q-btn v-if="clearButton !== ''" color="primary" @click="clear">{{ clearButton }}</q-btn>
      <q-btn v-if="resetButton !== ''" color="primary" @click="reset">{{ resetButton }}</q-btn>
      <q-btn v-if="submitButton !== ''" color="primary" @click="submit" loader>{{ submitButton }}</q-btn>
    </div>
  </div>
</template>

<script>
import logger from 'loglevel'
import { QBtn } from 'quasar'
import KFieldGroup from './KFieldGroup.vue'

export default {
  name: 'k-form',
  components: {
    QBtn,
    KFieldGroup
  },
  props: {
    schema: {
      type: [String, Object],
      default: () => ({})
    },
    submitButton: {
      type: String,
      default: 'Submit'
    },
    clearButton: {
      type: String,
      default: ''
    },
    resetButton: {
      type: String,
      default: ''
    }
  },
  watch: {
    schema: function () {
      this.isReady = false
    }
  },
  methods: {
    onFieldGroupReady () {
      this.isReady = true
      this.$emit('form-ready')
    },
    fill (values) {
      if (this.isReady) {
        this.$refs.fields.fill(values)
      } else {
        logger.warn('Trying to fill a non-ready form')
      }
    },
    clear () {
      if (this.isReady) {
        this.$refs.fields.clear()
      } else {
        logger.warn('Trying to clear a non-ready form')
      }
    },
    reset () {
      if (this.isReady) {
        this.$refs.fields.reset()
      } else {
        logger.warn('Trying to reset a non-ready form')
      }
    },
    submit (event, done) {
      if (this.isReady) {
        let result = this.$refs.fields.validate()
        if (result.isValid) {
          this.$emit('submitted', result.values, done)
        } else {
          done()
        }
      } else {
        logger.warn('Trying to submit a non-ready form')
        done()
      }
    }
  }
}
</script>
