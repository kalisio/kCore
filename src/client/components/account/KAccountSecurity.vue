<template>
  <div>
    <div class="row items-center justify-center full-width sm-gutter">
      <!-- 
        Change password 
      -->
      <div class="col-10">
        <k-block
          color="grey" 
          title="Change your password ?"
          :text="`Your password protect your account, change it carefully.
          You will be asked to type your current password.`"
          action="Change password"
          @action-triggered="onChangePassword" />
      </div>
       <!-- 
        Change email 
      -->
      <div class="col-10">
        <k-block
          color="orange" 
          title="Change your email ?"
          :text="`Your email secures changes to your account credentials, change it carefully.
          You will be asked to type your current password.`"
          action="Change email"
          @action-triggered="onChangeEmail" />
      </div>
    </div>
  </div>
</template>

<script>
import { KBlock } from '../frame'

export default {
  name: 'k-account-security',
  components: {
    KBlock
  },
  data () {
    return {
      name: ''
    }
  },
  methods: {
    getService () {
      return this.$api.getService('users')
    },
    onChangePassword () {
      this.$router.push({name: 'change-password'})
    },
    onChangeEmail () {
      this.$router.push({name: 'send-change-identity'})
    }
  }
}
</script>