<template>
  <div class="row justify-center items-center">
    <img :src="banner">
  </div>
</template>

<script>
export default {
  name: 'k-screen-header',
  dependencies: ['store'],
  data () {
    return {
      banner: ''
    }
  },
  created () {
    let Store = this.store()
    let resolveAsset = Store.get('resolveAsset')
    this.banner = resolveAsset(Store.get('config.screen.header', 'kalisio-banner.png'))
  }
}
</script>
