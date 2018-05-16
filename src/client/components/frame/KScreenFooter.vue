<template>
  <small>
    <div class="row justify-center">
      <template v-for="link in links">
        <div :key="link.label">
          &nbsp;
          <a @click="onLinkClicked(link)" >
            {{$t(link.label)}}
          </a>
          &nbsp;
        </div>
      </template>
    </div>
  </small>
</template>

<script>
import { openURL } from 'quasar'

export default {
  name: 'k-screen-footer',
  data () {
    return {
      links: []
    }
  },
  methods: {
    onLinkClicked (link) {
      if (link.url) {
        openURL(link.url)
      } else if (link.route) {
        this.$router.push(link.route)
      }
    }
  },
  created () {
    this.links = this.$config('screen.footer', [])
  }
}
</script>
