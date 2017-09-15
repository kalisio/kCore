<template>
  <k-screen title="Change endpoint">
    <div slot="screen-content">
      <div class="column justify-center sm-gutter">
        <div>
          <blockquote>
            <p>
              Please enter the URL of the remote service to be used.
            </p>
          </blockquote>
        </div>
        <div>
          <k-form ref="form" :schema="schema" />
        </div>
        <div>
          <div class="row justify-around">
            <q-btn color="primary" @click="onCanceled">Cancel</q-btn>
            <q-btn color="primary" @click="onApplied">Apply</q-btn>
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
        "$id": "http://kalisio.xyz/schemas/change-endpoint.json#",
        "title": "Change Endpoint form",
        "description": "Change remote service URL form",
        "type": "object",
        "properties": {
          "url": { 
            "type": "string", 
            "format": "uri",
            "field": {
              "component": "form/KTextField",
              "label": "URL",
              "helper": "Enter remote URL",
            }
          }
        },
        "required": ["url"],
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
      let result = this.$refs.form.validate()
      if (result.isValid) {
        this.$api.setBaseUrl(result.values.url)
        this.$router.push({name: 'login'})
      }
    },
    onCanceled () {
      this.$router.push({name: 'login'})
    }
  }
}
</script>
