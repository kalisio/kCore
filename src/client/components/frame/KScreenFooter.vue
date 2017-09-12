<template>
  <small>
    <div class="row justify-center">
      <template v-for="link in links">
        <div>
          &nbsp;
          <a @click="onLinkClicked(link.url)" >
            {{ link.label }}
          </a>
          &nbsp;
        </div>
      </template>
    </div>
  </small>
</template>

<script>
import _ from 'lodash'
import { openURL } from 'quasar'

export default {
  name: 'k-screen-footer',
  data () {
    return {
      links: []
    }
  },
  methods: {
    onLinkClicked (url) {
      openURL(url)
    }
  },
  created () {
    this.links = this.$store.get('config.screen.footer', [])
  }
}
</script>
