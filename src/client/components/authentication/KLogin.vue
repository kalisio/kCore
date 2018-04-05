<template>
  <k-screen :title="$t('KLogin.TITLE')">
    <div slot="screen-content">
      <div class="column justify-center sm-gutter">
        <!-- 
          Login providers
        -->
        <div v-if="canLogWith()">
          <div class="row justify-around" style="padding: 18px">
            <q-btn v-for="provider in providers" :icon="'fa-' + provider" :id="provider" @click="onLogWith(provider)" :key="provider">{{provider}}</q-btn>
          </div>
          <div class="row items-center"> 
            <div class="col-1"><h6>{{ $t('KLogin.OR_LABEL') }}</h6></div>
            <div class="col-11"><hr></div>
          </div>
        </div>
        <!-- 
          Login form 
        -->
        <div>
          <k-form ref="form" :schema="schema" />
        </div>
        <div class="self-center">
          <q-btn color="primary" loader id="local" @click="onLogin">{{$t('KLogin.APPLY_BUTTON')}}</q-btn>
        </div>
        <!-- 
          Additionnal links
        -->
        <div class="self-center">
          <a id="reset-password-link" @click="$router.push({name: 'send-reset-password'})">
            {{$t('KLogin.FORGOT_YOUR_PASSWORD_LINK')}}
          </a>
          &nbsp;&nbsp;
          <a id="register-link" @click="$router.push({name: 'register'})">
            {{$t('KLogin.DONT_HAVE_AN_ACCOUNT_LINK')}}
          </a>
          &nbsp;&nbsp;
          <a  v-if="canChangeEndpoint()" id="change-endpoint-link" @click="$router.push({name: 'change-endpoint'})">
            {{$t('KLogin.CHANGE_ENDPOINT_LINK')}}
          </a>
        </div>
      </div>
    </div>
  </k-screen>
</template>

<script>
import { QList, QItem, QItemMain, QBtn, Toast, Platform } from 'quasar'
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
        "type": "object",
        "properties": {
          "email": { 
            "type": "string", 
            "format": "email",
            "field": {
              "component": "form/KEmailField",
              "helper": "KLogin.EMAIL_FIELD_HELPER",
            }
          },
          "password": { 
            "type": "string",
            "field": {
              "component": "form/KPasswordField",
              "helper": "KLogin.PASSWORD_FIELD_HELPER",
            }
          }
        },
        "required": ["email", "password"]
      },
      providers: []
    }
  },
  mixins: [mixins.authentication],
  methods: {
    canChangeEndpoint () {
      return DEV ? true : Platform.is.cordova
    },
    canLogWith () {
      if (this.providers.length === 0) return false
      else return DEV ? true : !Platform.is.cordova
    },
    onLogin (event, done) {
      let result = this.$refs.form.validate()
      if (result.isValid) {
        this.login(result.values.email, result.values.password)
        .then(() => {
          done()
        })
        .catch(() => {
          Toast.create.negative({
            html: this.$t('KLogin.LOGIN_ERROR'),
            timeout: 5000
          })
          done()
        })
      } else {
        done()
      }
    },
    onLogWith (provider) {
      const authUrl = this.$api.getBaseUrl() + '/auth/' + provider.toLowerCase()
      const callbackUrl = authUrl + '/callback'
      if (Platform.is.cordova) {
        // Use in app browser so that we can intercept the redirect on the callback URL
        let authBrowser = window.cordova.InAppBrowser.open(authUrl, '_blank', 'location=no,clearsessioncache=yes,clearcache=yes')
        // Detect when the login has finished and the feathers cookie is ready
        authBrowser.addEventListener('loadstop', event => {
          // Detect the callback URL from backend, take care it is also used in the OAuth2 login screen as query parameter
          if (event.url.includes('/callback') && !event.url.includes('redirect_uri')) {
            let callbackBrowser = window.cordova.InAppBrowser.open(callbackUrl, '_blank', 'location=no,clearsessioncache=yes,clearcache=yes')
            callbackBrowser.addEventListener('loadstop', event => {
              // Detect when the login has finished and the feathers cookie is ready
              if (event.url.includes(this.$api.getBaseUrl())) {
                // FIXME: customize cookie name
                callbackBrowser.executeScript(
                  // Code to extract JWT from cookie
                  { code: 'document.cookie.valueOf("feathers-jwt")' }, token => {
                    window.localStorage.setItem('feathers-jwt', token)
                    callbackBrowser.close()
                    authBrowser.close()
                    // Restore session
                    this.$router.push({ name: 'home' })
                  }
                )
              }
            })
          }
        })
      } else {
        location.href = authUrl
      }
    }
  },
  created () {
    // Retrieve the availalbe providers
    this.providers = this.$config('login.providers', [])
  }
}
</script>
