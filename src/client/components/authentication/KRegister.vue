<template>
  <k-screen title="Register">
    <div slot="screen-content">
      <div class="column justify-center sm-gutter">
        <!--
          Register form
        -->
        <div>
          <k-form ref="form" :schema="schema" />
        </div>
        <div class="self-center">
          <q-btn id="register" color="primary" loader @click="onRegister">Register</q-btn>
        </div>
        <!--
          Additionnal links
        -->
        <div class="self-center">
          <a @click="$router.push({name: 'login'})">
            Already have an account ?
          </a>
          &nbsp;&nbsp;
          <a v-if="isCordova" @click="$router.push({name: 'change-endpoint'})">
            Change endpoint ?
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
              "label": "Name",
              "helper": "Type your name",
            }
          },
          "email": { 
            "type": "string", 
            "format": "email",
            "field": {
              "component": "form/KEmailField",
              "label": "Email",
              "helper": "Type your email address",
            }
          },
          "password": { 
            "type": "string",
            "field": {
              "component": "form/KPasswordField",
              "label": "Password",
              "helper": "Type your password",
            }
          },
          "confirmPassword": { 
            "const": { 
              "$data": "1/password" 
            },
            "field": {
              "component": "form/KPasswordField",
              "label": "Confirm Password",
              "helper": "Type your password again",
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
        .then(_ => {
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
