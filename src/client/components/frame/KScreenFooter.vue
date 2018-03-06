<template>
  <small>
    <div class="row justify-center">
      <template v-for="link in links">
        <div :key="link.label">
          &nbsp;
          <a @click="onLinkClicked(link.url)" >
            {{$t(link.label)}}
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
    this.links = this.$config('screen.footer', [])
  }
}
</script>
