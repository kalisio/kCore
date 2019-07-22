<template>
  <k-screen :title="canLogWith() ? $t('KLogin.TITLE') : ''" :links="links">
    <div slot="screen-content">
      <div class="column justify-center q-gutter-sm">
        <!--
          Login providers
        -->
        <div v-if="canLogWith()">
          <div class="row justify-around" style="padding: 18px">
            <template v-for="provider in providers">
              <q-btn :icon="'fab fa-' + provider" :id="provider" @click="onLogWith(provider)" :key="provider"
                     :label="provider">
              </q-btn>
            </template>
          </div>
          <div class="row items-center">
            <div class="col-1"><h6 class="margin-block-none">{{ $t('KLogin.OR_LABEL') }}</h6></div>
            <div class="col-11"><hr></div>
          </div>
        </div>
        <!--
          Login form
        -->
        <div>
          <k-form ref="form" :schema="schema" @form-ready="onFormReady"/>
        </div>
        <div class="self-center">
          <k-btn color="primary" id="local" @click="onLogin">
            {{ $t('KLogin.APPLY_BUTTON') }}
          </k-btn>
        </div>
      </div>
    </div>
  </k-screen>
</template>

<script>
import { QBtn, Platform } from 'quasar'
import { KScreen } from '../frame'
import { KBtn } from '../input'
import { KForm } from '../form'
import mixins from '../../mixins'

export default {
  name: 'k-login',
  components: {
    QBtn,
    KForm,
    KScreen,
    KBtn
  },
  data () {
    return {
      schema: {
        '$schema': 'http://json-schema.org/draft-06/schema#',
        '$id': 'http:/kalisio.xyz/schemas/login.json#',
        'title': 'Login form',
        'type': 'object',
        'properties': {
          'email': {
            'type': 'string',
            'format': 'email',
            'field': {
              'component': 'form/KEmailField',
              'helper': 'KLogin.EMAIL_FIELD_HELPER'
            }
          },
          'password': {
            'type': 'string',
            'field': {
              'component': 'form/KPasswordField',
              'helper': 'KLogin.PASSWORD_FIELD_HELPER'
            }
          }
        },
        'required': ['email', 'password']
      },
      providers: [],
      links: [],
      displayDetails: false
    }
  },
  mixins: [mixins.authentication, mixins.version],
  methods: {
    canLogWith () {
      if (this.providers.length === 0) return false
      else return process.env.DEV ? true : !Platform.is.cordova
    },
    storeCredentials () {
      return Platform.is.cordova
    },
    hasCredentials () {
      return window.localStorage.getItem('klogin.email')
    },
    onFormReady (form) {
      if (this.storeCredentials() && this.hasCredentials()) {
        form.fill({
          email: window.localStorage.getItem('klogin.email')
        })
      }
    },
    onLogin (event) {
      let result = this.$refs.form.validate()

      if (result.isValid) {
        event.loading(true)

        this.login(result.values.email, result.values.password)
        .then(() => {
          if (this.storeCredentials()) {
            window.localStorage.setItem('klogin.email', result.values.email)
          }
          event.loading(false)
        })
        .catch((e) => {
          this.$toast({
            type: 'negative',
            message: this.$t('KLogin.LOGIN_ERROR'),
            timeout: 5000
          })

          event.loading(false)
        })
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
    // Configure this screen
    this.providers = this.$config('screens.login.providers', [])
    this.links = this.$config('screens.login.links', [])
  }
}
</script>

<style>
  .link {
    padding: 8px;
  }
</style>