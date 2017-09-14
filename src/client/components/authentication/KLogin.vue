<template>
  <k-screen title="Log in with">
    <div slot="screen-content">
      <div class="column justify-center">
        <!-- 
          Login providers
        -->
        <div v-if="providers.length > 0">
          <div class="row justify-around" style="padding: 18px">
            <q-btn v-for="provider in providers" :icon="'fa-' + provider" @click="onLogWith(provider)" :key="provider">{{provider}}</q-btn>
          </div>
          <div class="row items-center"> 
            <div class="col-1"><h6>Or</h6></div>
            <div class="col-11"><hr></div>
          </div>
        </div>
        <!-- 
          Login form 
        -->
        <div>
          <k-form :schema="schema" submitButton="Log In" @submitted="onSubmitted" />
        </div>
        <!-- 
          Additionnal links
        -->
        <div class="self-center">
          <a @click="$router.push({name: 'reset-password'})">
            Forgot your password ?
          </a>
          &nbsp;&nbsp;
          <a @click="$router.push({name: 'register'})">
            Don't have an account ?
          </a>
        </div>
      </div>
    </div>
  </k-screen>
</template>

<script>
import { QList, QItem, QItemMain, QBtn } from 'quasar'
import { KScreen } from '../frame'
import { KForm } from '../form'
import mixins from '../../mixins'

export default {
  name: 'k-login',
  components: {
    QList,
    QItem,
    QItemMain,
    QBtn,
    KForm,
    KScreen
  },
  data () {
    return {
      schema: {
        "$schema": "http://json-schema.org/draft-06/schema#",
        "$id": "http:/kalisio.xyz/schemas/login.json#",
        "title": "Login form",
        "description": "Authentication login form",
        "type": "object",
        "properties": {
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
          }
        },
        "required": ["email", "password"],
        "form": {
          "type": "object",
          "properties":  {
            "icon": false,
            "label": true,
            "labelWidth": 3
          }
        }
      },
      providers: []
    }
  },
  mixins: [mixins.authentication],
  methods: {
    onSubmitted (data, done) {
      this.login(data.email, data.password)
      .then(_ => {
        done()
      })
      .catch(_ => {
        done()
      })
    },
    onLogWith (provider) {
      location.href = '/auth/' + provider.toLowerCase()
    }
  },
  created () {
    // Retrieve the availalbe providers
    this.providers = this.$store.get('config.login.providers', [])
  }
}
</script>
