import { Events } from 'quasar'

let versionMixin = {
  data () {
    return {
      clientVersionName: '',
      apiVersionName: ''
    }
  },
  methods: {
    refreshVersionNames () {
      const capabilities = this.$store.get('capabilities')
      if (capabilities) {
        if (capabilities.client) {
          this.clientVersionName = capabilities.client.version
          if (capabilities.client.buildNumber) {
            this.clientVersionName += ' (' + capabilities.client.buildNumber + ')'
          }
        }
        if (capabilities.api) {
          this.apiVersionName = capabilities.api.version
          if (capabilities.api.buildNumber) {
            this.apiVersionName += ' (' + capabilities.api.buildNumber + ')'
          }
        }
      }
    }
  },
  created () {
    this.refreshVersionNames()
    Events.$on('capabilities-api-changed', this.refreshVersionNames)
  },
  beforeDestroy () {
    Events.$off('capabilities-api-changed', this.refreshVersionNames)
  }
}

export default versionMixin
