<template>
  <k-screen title="Your are now logged out">
    <div slot="screen-content">
      <div class="column justify-center">
        <!--
          Quote
        -->
        <div>
          <blockquote class="text-right">
            <p>Thank you for using <cite>{{ appName }}</cite>.</p>
            <small v-if="publisherName">The <cite>{{ publisherName }}</cite> team</small>
          </blockquote>
        </div>
        <!--
          Additionnal links
        -->
        <div class="self-center">
          <a @click="$router.push({name: 'login'})">
            Log in again ?
          </a>
        </div>
      </div>
    </div>
  </k-screen>
</template>

<script>
import { KScreen } from '../screen'
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
    this.publisherName = this.$store.get('config.publisher.name', 'Kalisio')
    this.logout()
  }
}
</script>
