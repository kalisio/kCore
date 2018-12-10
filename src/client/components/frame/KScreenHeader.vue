<template>
  <div class="row justify-center">
    {{ $t(message) }}
  </div>
</template>

<script>
export default {
  name: 'k-screen-header',
  computed: {
    message () {
      if (DEV) return 'KScreen.DEVELOPMENT_VERSION'
      if (TEST) return 'KScreen.STAGING_VERSION'
      return ''
    }
  }
}
</script>