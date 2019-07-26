<template>
  <k-screen :title="$t('KRegister.TITLE')" :links="links">
    <div slot="screen-content">
      <div class="column justify-center q-gutter-sm">
        <div>
          <k-form ref="form" :schema="getSchema()" />
        </div>
        <div class="self-center">
          <k-btn color="primary" id="register" @click="onRegister">
            {{$t('KRegister.APPLY_BUTTON')}}
          </k-btn>
        </div>
      </div>
    </div>
  </k-screen>
</template>

<script>
import { KScreen } from '../frame'
import { KForm } from '../form'
import { KBtn } from '../input'
import mixins from '../../mixins'
import { getLocale } from '../../utils'
import { Events } from '../../events'

export default {
  name: 'k-register',
  components: {
    KForm,
    KScreen,
    KBtn
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
    async onRegister (event) {
      let result = this.$refs.form.validate()
      if (result.isValid) {
        event.loading(true)
        // Add the locale information
        result.values.locale = getLocale()
        try {
          await this.register(result.values)
        } catch (_) {
        }
        event.loading(false)
      }
    }
  },
  created () {
    // Configure this screen
    this.links = this.$config('screens.register.links', [])
  }
}
</script>
