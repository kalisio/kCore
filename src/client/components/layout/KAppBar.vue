<template>
  <q-toolbar>
    <!--
      SideNav menu
     -->
    <q-btn flat icon="menu" @click="$emit('menu-clicked')" />
    <!-- 
      Title/subtitle section
     -->
    <q-toolbar-title>
      {{ title }}
      <span slot="subtitle">
        {{ subTitle }}
      </span>
    </q-toolbar-title>
    <!--
      Actions section
     -->
    <template v-for="(action,index) in actions">
      <q-btn flat :key="index" :icon="action.icon" @click="$router.push(action.route)" />
    </template>
    <!-- 
      Voice ?
     -->
    <k-voice v-if="isVoiceEnabled"/>
  </q-toolbar>
</template>

<script>
import { Events, QToolbar, QToolbarTitle, QBtn } from 'quasar'
import KVoice from './KVoice.vue'

export default {
  name: 'k-app-bar',
  components: {
    QToolbar,
    QToolbarTitle,
    QBtn,
    KVoice
  },
  computed: {
    title () {
      return this.content ? this.content.title : 'kApp'
    },
    subTitle () {
      return this.content ? this.content.subTitle : 'Powered by Kalisio'
    },
    actions () {
      return this.content ? this.content.actions : []
    },
    isVoiceEnabled () {
      return this.content ? this.content.speech : false
    }
  },
  data () {
    return {
      content: null
    }
  },
  methods: {
    refresh (content) {
      this.content = content
    }
  },
  created () {
    this.refresh(this.$store.get('appBar', this.$store.get('config.appBar')))
    Events.$on('app-bar-changed', this.refresh)
  },
  beforeDestroy() {
    Events.$off('app-bar-changed', this.refresh)
  }
}
</script>
