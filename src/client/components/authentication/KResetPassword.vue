<template>
  <k-screen title="Reset password">
    <div slot="screen-content">
      <div class="column justify-center sm-gutter">
        <div>
          <blockquote>
            <p>
              We'll email you instructions on how to reset your password.<br>
              Please enter your email address.
            </p>
          </blockquote>
        </div>
        <div>
          <k-form ref="form" :schema="schema" />
        </div>
        <div>
          <div class="row justify-around">
            <q-btn color="primary" @click="onCanceled">Cancel</q-btn>
            <q-btn color="primary" loader @click="onApplied">Apply</q-btn>
          </div>
        </div>
      </div>
    </div>
  </k-screen>
</template>

<script>
import { QBtn } from 'quasar'
import { KScreen } from '../frame'
import { KForm } from '../form'

export default {
  name: 'k-reset-password',
  components: {
    QBtn,
    KScreen,
    KForm
  },
  data () {
    return {
      schema: {
        "$schema": "http://json-schema.org/draft-06/schema#",
        "$id": "http://kalisio.xyz/schemas/reset-password.json#",
        "title": "Reset Paswword form",
        "description": "Authentication reset password form",
        "type": "object",
        "properties": {
          "email": { 
            "type": "string", 
            "format": "email",
            "field": {
              "component": "form/KPasswordField",
              "label": "Email",
              "helper": "Enter your email address",
            }
          }
        },
        "required": ["email"],
        "form": {
          "type": "object",
          "properties":  {
            "icon": false,
            "label": true,
            "labelWidth": 3
          }
        }
      }
    }
  },
  methods: {
    onApplied (data) {
      // TODO
    },
    onCanceled () {
      this.$router.push({name: 'login'})
    }
  }
}
</script>
