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
      </div>
    </div>
  </k-screen>
</template>

<script>
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
      publisherName: ''
    }
  },
  mixins: [mixins.authentication],
  created () {
    this.appName = this.$store.get('config.appName', 'kApp')
    this.publisherName = this.$store.get('config.publisher', 'Kalisio')
    this.logout()
  }
}
</script>
