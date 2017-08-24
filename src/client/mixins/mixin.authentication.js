let authenticationMixin = {
  methods: {
    restoreUser (accessToken) {
      return this.$api.passport.verifyJWT(accessToken)
      .then(payload => {
        return this.$api.users.get(payload.userId)
      })
      .then(user => {
        this.$store.set('user', user)
      })
    },
    register (user) {
      delete user.confirmPassword
      // TODO: delete user.policiesAccepted
      return this.$api.users.create(user)
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
      return this.$api.authenticate({
        strategy: 'local',
        email: email,
        password: password
      })
      .then(response => {
        return this.restoreUser(response.accessToken)
      })
    },
    logout () {
      return this.$api.logout()
      .then(_ => {
        this.$store.set('user', null)
      })
    }
  }
}

export default authenticationMixin
