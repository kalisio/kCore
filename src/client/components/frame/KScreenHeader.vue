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
    this.banner = this.$load(this.$config('screen.header', 'kalisio-banner.png'), 'asset')
  }
}
</script>
