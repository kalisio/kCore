<template>
  <k-screen :title="$t('KRegister.TITLE')">
    <div slot="screen-content">
      <div class="column justify-center sm-gutter">
        <!--
          Register form
        -->
        <div>
          <k-form ref="form" :schema="schema" />
        </div>
        <div class="self-center">
          <q-btn id="register" color="primary" loader @click="onRegister">{{$t('KRegister.APPLY_BUTTON')}}</q-btn>
        </div>
        <!--
          Additionnal links
        -->
        <div class="self-center">
          <a id="login-link" @click="$router.push({name: 'login'})">
            {{$t('KRegister.ALREADY_HAVE_AN_ACCOUNT_LINK')}}
          </a>
          &nbsp;&nbsp;
          <a v-if="canChangeEndpoint()" id="change-endpoint-link" @click="$router.push({name: 'change-endpoint'})">
            {{$t('KRegister.CHANGE_ENDPOINT_LINK')}}
          </a>
        </div>
      </div>
    </div>
  </k-screen>
</template>

<script>
import { QBtn, Platform, Toast } from 'quasar'
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
  data () {
    return {
      schema: {
        "$schema": "http://json-schema.org/draft-06/schema#",
        "$id": "http://kalisio.xyz/schemas/register.json#",
        "title": "Registration Form",
        "type": "object",
        "properties": {
          "name": { 
            "type": "string", 
            "minLength": 3,
            "maxLength": 128,
            "field": {
              "component": "form/KTextField",
              "helper": "KRegister.NAME_FIELD_HELPER",
            }
          },
          "email": { 
            "type": "string", 
            "format": "email",
            "field": {
              "component": "form/KEmailField",
              "helper": "KRegister.EMAIL_FIELD_HELPER",
            }
          },
          "password": { 
            "type": "string",
            "field": {
              "component": "form/KPasswordField",
              "helper": "KRegister.PASSWORD_FIELD_HELPER",
            }
          },
          "confirmPassword": { 
            "const": { 
              "$data": "1/password" 
            },
            "field": {
              "component": "form/KPasswordField",
              "helper": "KRegister.CONFIRM_PASSWORD_FIELD_HELPER",
            }
          }
        },
        "required": ["name", "email", "password", "confirmPassword"]
      }
    }
  },
  mixins: [mixins.authentication],
  methods: {
    canChangeEndpoint () {
      return DEV ? true : Platform.is.cordova
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
          done()
        })
      } else {
        done()
      }
    }
  }
}
</script>
