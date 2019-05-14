<template>
  <div class="row justify-center">
    {{ $t(message) }}
  </div>
</template>

<script>
import config from 'config'

export default {
  name: 'k-screen-header',
  computed: {
    message () {
      if (config.flavor === 'prod') return ''
      else if (config.flavor === 'test') return 'KScreen.TEST_VERSION'
      else return 'KScreen.DEVELOPMENT_VERSION'
    }
  }
}
</script>