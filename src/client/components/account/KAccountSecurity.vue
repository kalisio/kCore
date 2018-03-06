<template>
  <div>
    <div class="row items-center justify-center full-width xs-gutter">
      <!-- 
        Change password 
      -->
      <div class="col-12">
        <k-block
          color="grey" 
          :title="$t('KAccountSecurity.TITLE_PASSWORD_BLOCK')"
          :text="$t('KAccountSecurity.TEXT_PASSWORD_BLOCK')"
          :action="$t('KAccountSecurity.ACTION_PASSWORD_BLOCK')"
          @action-triggered="onChangePassword" />
      </div>
       <!-- 
        Change email 
      -->
      <div class="col-12">
        <k-block
          color="orange" 
          :title="$t('KAccountSecurity.TITLE_EMAIL_BLOCK')"
          :text="$t('KAccountSecurity.TEXT_EMAIL_BLOCK')"
          :action="$t('KAccountSecurity.ACTION_EMAIL_BLOCK')"
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
    onChangePassword () {
      this.$router.push({name: 'change-password'})
    },
    onChangeEmail () {
      this.$router.push({name: 'send-change-identity'})
    }
  }
}
</script>