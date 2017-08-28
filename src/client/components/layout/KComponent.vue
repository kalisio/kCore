<template>
  <component :is="component.renderer" />
</template>

<script>
import KLayout from './KLayout.vue'

export default {
  name: 'k-component',
  components: {
    KLayout
  }
}
</script>