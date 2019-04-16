<template>
  <k-screen :title="$t('KRegister.TITLE')" :links="links">
    <div slot="screen-content">
      <div class="column justify-center sm-gutter">
        <div>
          <k-form ref="form" :schema="getSchema()" />
        </div>
        <div class="self-center">
          <q-btn id="register" color="primary" loader @click="onRegister">{{$t('KRegister.APPLY_BUTTON')}}</q-btn>
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
import { getLocale } from '../../utils'

export default {
  name: 'k-register',
  components: {
    QBtn,
    KForm,
    KScreen
  },
  mixins: [mixins.authentication],
  data () {
    return {
      links: []
    }
  },
  methods: {
    getSchema () {
      return {
        '$schema': 'http://json-schema.org/draft-06/schema#',
        '$id': 'http://kalisio.xyz/schemas/register.json#',
        'title': 'Registration Form',
        'type': 'object',
        'properties': {
          'name': {
            'type': 'string',
            'minLength': 3,
            'maxLength': 128,
            'field': {
              'component': 'form/KTextField',
              'helper': 'KRegister.NAME_FIELD_HELPER'
            }
          },
          'email': {
            'type': 'string',
            'format': 'email',
            'field': {
              'component': 'form/KEmailField',
              'helper': 'KRegister.EMAIL_FIELD_HELPER'
            }
          },
          'password': {
            'type': 'string',
            'field': {
              'component': 'form/KPasswordField',
              'helper': 'KRegister.PASSWORD_FIELD_HELPER'
            }
          },
          'confirmPassword': {
            'const': {
              '$data': '1/password'
            },
            'field': {
              'component': 'form/KPasswordField',
              'helper': 'KRegister.CONFIRM_PASSWORD_FIELD_HELPER'
            }
          },
          'consentTerms': {
            'type': 'boolean',
            'default': false,
            'enum': [ true ],
            'field': {
              'component': 'form/KToggleField',
              'helper': this.$t('KRegister.ACCEPT_TERMS_HELPER', { domain: this.$config('domain') }),
              'errorLabel': this.$t('KRegister.ACCEPT_TERMS_ERROR_LABEL', { domain: this.$config('domain') }),
              'checked-icon': 'check',
              'unchecked-icon': 'clear'
            }
          }
        },
        'required': ['name', 'email', 'password', 'confirmPassword', 'consentTerms']
      }
    },
    onRegister (event, done) {
      let result = this.$refs.form.validate()
      if (result.isValid) {
        // Add the locale information
        result.values.locale = getLocale()
        this.register(result.values)
        .then(() => {
          done()
        })
        .catch(error => {
          done(error)
        })
      } else {
        done()
      }
    }
  },
  created () {
    // Configure this screen
    this.links = this.$config('screens.register.links', [])
  }
}
</script>
