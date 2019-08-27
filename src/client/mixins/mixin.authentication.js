// import { Platform } from 'quasar'

const authenticationMixin = {
  methods: {
    restoreUser (accessToken) {
      return this.$api.passport.verifyJWT(accessToken)
        .then(payload => {
        // Anonymous user or service account ?
          if (!payload.userId) return { name: this.$t('ANONYMOUS'), anonymous: true }
          else return this.$api.getService('users').get(payload.userId)
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
        .then(() => {
          return this.login(user.email, user.password)
        })
    },
    restoreSession () {
      return this.$api.authenticate()
        .then(response => {
          return this.restoreUser(response.accessToken)
            .catch(error => {
              // This ensure an old token is not kept when the user has been deleted
              if (error.code === 404) {
                this.logout()
              }
              // Rethrow for caller to handle
              throw error
            })
        })
    },
    login (email, password) {
      const payload = {
        strategy: 'local',
        email: email,
        password: password
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
