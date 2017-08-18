<template>
  <k-screen title="Reset password">
   <div slot="screen-content" class="column justify-center">
      <div>
        We'll email you instructions on how to reset your password.
      </div>
      <div>
        <k-form :schema="schema" submitButton="Submit" @submitted="onSubmitted" cancelButton="Cancel" @canceled="onCanceled"/>
      </div>
    </div>
  </k-screen>
</template>

<script>
import { KScreen } from '../screen'
import { KForm } from '../form'

export default {
  name: 'k-reset-password',
  components: {
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
              "type": "email",
              "label": "Email",
              "helper": "Type your email address",
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
    onSubmitted (data) {
      // TODO
    },
    onCanceled () {
      this.$router.push({name: 'login'})
    }
  }
}
</script>
