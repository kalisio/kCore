<template>
  <q-toolbar>
    <q-btn flat icon="menu" @click="$emit('menu-clicked')" />
    <q-toolbar-title>
      {{ title }}
      <span slot="subtitle">
        {{ subtitle }}
      </span>
    </q-toolbar-title>
    <k-voice v-if="voiceEnabled"/>
  </q-toolbar>
</template>

<script>
import { QToolbar, QToolbarTitle, QBtn } from 'quasar'
import KVoice from './KVoice.vue'

export default {
  name: 'k-app-bar',
  components: {
    QToolbar,
    QToolbarTitle,
    QBtn,
    KVoice
  },
  dependencies: ['store'],
  data () {
    return {
      title: '',
      subtitle: '',
      voiceEnabled: false
    }
  },
  created () {
    // Apply the configuration
    this.title = this.store().get('config.appBar.title', 'kApp')
    this.subtitle = this.store().get('config.appBar.subtitle', 'Powered by Kaelia')
    this.voiceEnabled = this.store().get('config.appBar.speech', false)
  }
}
</script>
