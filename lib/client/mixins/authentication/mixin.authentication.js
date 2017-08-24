'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var authenticationMixin = {
  methods: {
    restoreUser: function restoreUser(accessToken) {
      var _this = this;

      return this.$api.passport.verifyJWT(accessToken).then(function (payload) {
        return _this.$api.users.get(payload.userId);
      }).then(function (user) {
        _this.$store.set('user', user);
      });
    },
    register: function register(user) {
      var _this2 = this;

      delete user.confirmPassword;
      // TODO: delete user.policiesAccepted
      return this.$api.users.create(user).then(function (_) {
        return _this2.login(user.email, user.password);
      });
    },
    restoreSession: function restoreSession() {
      var _this3 = this;

      return this.$api.authenticate().then(function (response) {
        return _this3.restoreUser(response.accessToken);
      });
    },
    login: function login(email, password) {
      var _this4 = this;

      return this.$api.authenticate({
        strategy: 'local',
        email: email,
        password: password
      }).then(function (response) {
        return _this4.restoreUser(response.accessToken);
      });
    },
    logout: function logout() {
      var _this5 = this;

      return this.$api.logout().then(function (_) {
        _this5.$store.set('user', null);
      });
    }
  }
};

exports.default = authenticationMixin;
module.exports = exports['default'];