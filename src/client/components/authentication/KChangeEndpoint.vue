<template>
  <k-screen :title="$t('KChangeEndpoint.TITLE')" :links="links">
    <div slot="screen-content">
      <div class="column justify-center sm-gutter">
         <!-- 
          Change endpoint form
        -->
        <div>
          <k-form ref="form" :schema="schema" />
        </div>
        <div>
          <div class="row justify-around">
            <q-btn color="primary" @click="onReset">{{$t('KChangeEndpoint.RESET_BUTTON')}}</q-btn>
            <q-btn color="primary" @click="onApplied">{{$t('KChangeEndpoint.APPLY_BUTTON')}}</q-btn>
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
      links: [],
      schema: {
        '$schema': 'http://json-schema.org/draft-06/schema#',
        '$id': 'http://kalisio.xyz/schemas/change-endpoint.json#',
        'title': 'Change Endpoint form',
        'description': 'Change remote service URL form',
        'type': 'object',
        'properties': {
          'baseUrl': {
            'type': 'string',
            'format': 'uri',
            'field': {
              'component': 'form/KTextField',
              'helper': 'KChangeEndpoint.BASE_URL_FIELD_HELPER'
            }
          }
        },
        'required': ['baseUrl']
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
  created () {
    // configure this screen
    this.links = this.$config('screens.changeEndpoint.links', [])
    this.loadRefs()
    .then(() => this.$refs.form.build())
    .then(() => {
      this.$refs.form.fill({
        baseUrl: this.$api.getBaseUrl()
      })
    })
  }
}
</script>
