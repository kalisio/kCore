<template>
  <k-screen :title="$t('KLogout.TITLE')">
    <div slot="screen-content">
      <div class="column justify-center">
        <!--
          Quote
        -->
        <div>
          <blockquote class="text-right">
            <p>{{$t('KLogout.SIGN_OFF_LABEL')}}&nbsp;<cite>{{appName}}</cite>.</p>
            <small v-if="publisherName"><cite>{{publisherName}}</cite></small>
          </blockquote>
        </div>
        <!--
          Additionnal links
        -->
        <div class="self-center">
          <a id="login-link" @click="$router.push({name: 'login'})">
            {{$t('KLogout.LOG_IN_AGAIN_LINK')}}
          </a>
        </div>
        <br>
        <div class="text-center">
          <small v-if="clientVersionName"><cite>{{$t('KLogout.CLIENT_VERSION')}} {{clientVersionName}}</cite></small>
          <small v-if="apiVersionName"><cite>- {{$t('KLogout.API_VERSION')}} {{apiVersionName}}</cite></small>
        </div>
      </div>
    </div>
  </k-screen>
</template>

<script>
import { Events } from 'quasar'
import { KScreen } from '../frame'
import mixins from '../../mixins'

export default {
  name: 'k-logout',
  components: {
    KScreen
  },
  data () {
    return {
      appName: '',
      publisherName: '',
      clientVersionName: '',
      apiVersionName: ''
    }
  },
  mixins: [mixins.authentication],
  methods: {
    refreshVersionNames () {
      const about = this.$store.get('about')
      if (about) {
        if (about.client) {
          this.clientVersionName = about.client.version
          if (about.client.buildNumber) {
            this.clientVersionName += ' (' + about.client.buildNumber + ')'
          }
        }
        if (about.api) {
          this.apiVersionName = about.api.version
          if (about.api.buildNumber) {
            this.apiVersionName += ' (' + about.api.buildNumber + ')'
          }
        }
      }
    }
  },
  created () {
    this.appName = this.$config('appName', 'kApp')
    this.publisherName = this.$config('publisher', 'Kalisio')
    this.refreshVersionNames()
    Events.$on('about-api-changed', this.refreshVersionNames)
    this.logout()
  }
}
</script>
