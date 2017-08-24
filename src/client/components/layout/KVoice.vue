<template>
  <q-btn flat :icon="voiceIcon" @click="onToggleVoice()" />
</template>

<script>
import logger from 'loglevel'
import { Toast, Events, QBtn } from 'quasar'
import annyang from 'annyang'

export default {
  name: 'k-voice',
  components: {
    QBtn
  },
  data () {
    return {
      listening: false,
      speech: false
    }
  },
  computed: {
    voiceIcon () {
      if (!this.listening) return 'mic'
      if (this.speech) return 'record_voice_over'
      return 'mic_off'
    }
  },
  methods: {
    setVoiceEnabled (enabled) {
      this.listening = enabled
      if (enabled) {
        if (!annyang.isListening()) {
          annyang.start({ autoRestart: true, continuous: false })
        }
      } else if (annyang.isListening()) {
        annyang.abort()
      }
    },
    onToggleVoice () {
      this.setVoiceEnabled(!this.listening)
    }
  },
  created () {
    // Set a language for speech recognition (defaults to English)
    // For a full list of language codes, see the documentation:
    // https://github.com/TalAter/annyang/blob/master/docs/FAQ.md#what-languages-are-supported
    // FIXME: need to add an auto-configuration according to the browser language
    annyang.setLanguage(this.$store.get('config.appBar.speech.language', 'en'))
  },
  mounted () {
    if (annyang.isListening()) {
      this.listening = true
    }

    // Activate debug mode for detailed logging in the console
    if (logger.getLevel() >= logger.levels.DEBUG) {
      annyang.debug()
    }

    annyang.addCommands({
      'log out': () => { this.$router.push('/logout') },
      '(create) new *route': (route) => { this.$router.push('/home/' + route) },
      'edit *route': (route) => {
        // When no user identifier is given it's assume to be mine
        this.$router.push('/home/' + route + '/' + this.$store.get('user._id'))
      },
      'show (me) *route': (route) => { this.$router.push('/home/' + route) }
    })

    annyang.addCallback('soundstart', _ => { this.speech = true })
    annyang.addCallback('result', (userSaid, command, phrases) => {
      this.speech = false
    })
    annyang.addCallback('resultNoMatch', (phrases) => {
      // Emit event for those who'd like to use voice recognition
      Events.$emit('speech-recognition', phrases)
    })

    annyang.addCallback('error', data => {
      this.setVoiceEnabled(false)
      if (data.error !== 'no-speech' && data.error !== 'aborted') {
        let message = 'Speech recognition failed'
        if (data.message) message += ': ' + data.message
        Toast.create.negative(message)
      }
    })
  },
  beforeDestroy () {
    this.setVoiceEnabled(false)
  }
}
</script>
