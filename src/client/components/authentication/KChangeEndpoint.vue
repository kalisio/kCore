<template>
  <k-screen title="Change endpoint">
    <div slot="screen-content">
      <div class="column justify-center sm-gutter">
        <div>
          <blockquote>
            <p>
              Please enter the URL of the remote service to be used.
              <a @click="onReset">Click this link</a> if you want to reset it to the default value.
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
import mixins from '../../mixins'

export default {
  name: 'k-change-endpoint',
  components: {
    QBtn,
    KScreen,
    KForm
  },
  mixins: [
    mixins.refsResolver(['form'])
  ],
  data () {
    return {
      schema: {
        "$schema": "http://json-schema.org/draft-06/schema#",
        "$id": "http://kalisio.xyz/schemas/change-endpoint.json#",
        "title": "Change Endpoint form",
        "description": "Change remote service URL form",
        "type": "object",
        "properties": {
          "baseUrl": { 
            "type": "string", 
            "format": "uri",
            "field": {
              "component": "form/KTextField",
              "label": "URL",
              "helper": "Enter remote URL",
            }
          }
        },
        "required": ["baseUrl"],
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
    onReset () {
      this.$api.setBaseUrl('')
      this.$router.push({name: 'login'})
      window.location.reload()
    },
    onApplied (data) {
      let result = this.$refs.form.validate()
      if (result.isValid) {
        this.$api.setBaseUrl(result.values.baseUrl)
        this.$router.push({name: 'login'})
        window.location.reload()
      }
    },
    onCanceled () {
      this.$router.push({name: 'login'})
    }
  },
  async created () {
    await this.loadRefs()
    await this.$refs.form.build()
    this.$refs.form.fill({
      baseUrl: this.$api.getBaseUrl()
    })
  }
}
</script>
