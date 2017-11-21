import { Platform } from 'quasar'

let authenticationMixin = {
  methods: {
    restoreUser (accessToken) {
      return this.$api.passport.verifyJWT(accessToken)
      .then(payload => {
        return this.$api.getService('users').get(payload.userId)
      })
      .then(user => {
        this.$store.set('user', user)
        return user
      })
    },
    register (user) {
      delete user.confirmPassword
      // TODO: delete user.policiesAccepted
      return this.$api.getService('users').create(user)
      .then(_ => {
        return this.login(user.email, user.password)
      })
    },
    restoreSession () {
      return this.$api.authenticate()
      .then(response => {
        return this.restoreUser(response.accessToken)
      })
    },
    login (email, password) {
      let payload = {
        strategy: 'local',
        email: email,
        password: password
      }
      // On mobile device we add the device information so that when authenticating
      // on a new device we can register it
      if (Platform.is.cordova && window.device) {
        payload.device = window.device
      }
      return this.$api.authenticate(payload)
      .then(response => {
        return this.restoreUser(response.accessToken)
      })
    },
    logout () {
      return this.$api.logout()
      .then(response => {
        this.$store.set('user', null)
      })
    }
  }
}

export default authenticationMixin
