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
        <div class="text-right">
          <small v-if="displayDetails && clientVersionName"><cite>{{$t('KLogout.CLIENT_VERSION')}} {{clientVersionName}}</cite></small>
          <small v-if="displayDetails && apiVersionName"><cite>- {{$t('KLogout.API_VERSION')}} {{apiVersionName}}</cite></small>
          <q-icon name="info" size="1.5rem" @click="displayDetails = !displayDetails"/>
        </div>
      </div>
    </div>
  </k-screen>
</template>

<script>
import { QIcon } from 'quasar'
import { KScreen } from '../frame'
import mixins from '../../mixins'

export default {
  name: 'k-logout',
  components: {
    KScreen,
    QIcon
  },
  data () {
    return {
      appName: '',
      publisherName: '',
      displayDetails: false
    }
  },
  mixins: [mixins.authentication, mixins.version],
  created () {
    this.appName = this.$config('appName')
    this.publisherName = this.$config('publisher', 'Kalisio')
    this.logout()
  }
}
</script>
