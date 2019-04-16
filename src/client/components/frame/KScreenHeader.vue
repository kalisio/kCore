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
      if (!process.env.NODE_APP_INSTANCE) return 'KScreen.DEVELOPMENT_VERSION'
      if (process.env.NODE_APP_INSTANCE === 'dev') return 'KScreen.DEVELOPMENT_VERSION'
      if (process.env.NODE_APP_INSTANCE === 'test') return 'KScreen.STAGING_VERSION'
      return ''
    }
  }
}
</script>