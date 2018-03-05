<template>
  <k-screen :title="$t('KRegister.REGISTER')">
    <div slot="screen-content">
      <div class="column justify-center sm-gutter">
        <!--
          Register form
        -->
        <div>
          <k-form ref="form" :schema="schema" />
        </div>
        <div class="self-center">
          <q-btn id="register" color="primary" loader @click="onRegister">{{ $t('KRegister.REGISTER') }}</q-btn>
        </div>
        <!--
          Additionnal links
        -->
        <div class="self-center">
          <a @click="$router.push({name: 'login'})">
            {{ $t('KRegister.ALREADY_HAVE_AN_ACCOUNT') }}
          </a>
          &nbsp;&nbsp;
          <a v-if="isCordova" @click="$router.push({name: 'change-endpoint'})">
            {{ $t('KRegister.CHANGE_ENDPOINT') }}
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
        "title": "Register Form",
        "description": "Authentication registration form",
        "type": "object",
        "properties": {
          "name": { 
            "type": "string", 
            "minLength": 3,
            "maxLength": 128,
            "field": {
              "component": "form/KTextField",
              "label": "KRegister.NAME",
              "helper": "KRegister.ENTER_YOUR_NAME",
            }
          },
          "email": { 
            "type": "string", 
            "format": "email",
            "field": {
              "component": "form/KEmailField",
              "label": "KRegister.EMAIL",
              "helper": "KRegister.ENTER_YOUR_EMAIL_ADDRESS",
            }
          },
          "password": { 
            "type": "string",
            "field": {
              "component": "form/KPasswordField",
              "label": "KRegister.PASSWORD",
              "helper": "KRegister.ENTER_YOUR_PASSWORD",
            }
          },
          "confirmPassword": { 
            "const": { 
              "$data": "1/password" 
            },
            "field": {
              "component": "form/KPasswordField",
              "label": "KRegister.CONFIRM_PASSWORD",
              "helper": "KRegister.CONFIRM_YOUR_PASSWORD",
            }
          }
        },
        "required": ["name", "email", "password", "confirmPassword"],
        "form": {
          "type": "object",
          "properties":  {
            "icon": false,
            "label": true,
            "labelWidth": 3
          }
        }
      },
      isCordova: DEV ? true : Platform.is.cordova
    }
  },
  mixins: [mixins.authentication],
  methods: {
    onRegister (event, done) {
      let result = this.$refs.form.validate()
      if (result.isValid) {
        this.register(result.values)
        .then(() => {
          done()
        })
        .catch(error => {
          const code = _.get(error, 'data.code')
          if (code === 11000) {
            Toast.create.negative({
              html: 'Email already taken',
              timeout: 10000
            })
          }
          done()
        })
      } else {
        done()
      }
    }
  }
}
</script>
