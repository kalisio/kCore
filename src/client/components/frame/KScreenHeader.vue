<template>
  <div class="row justify-center items-center">
    <img :src="banner">
  </div>
</template>

<script>
export default {
  name: 'k-screen-header',
  data () {
    return {
      banner: ''
    }
  },
  created () {
    let resolveAsset = this.$store.get('resolveAsset')
    this.banner = resolveAsset(this.$store.get('config.screen.header', 'kalisio-banner.png'))
  }
}
</script>
