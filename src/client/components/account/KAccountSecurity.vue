<template>
  <div>
    <div class="row items-center justify-center full-width q-gutter-xs">
      <!--
        Change password
      -->
      <div class="col-12">
        <k-block
          color="grey"
          :title="$t('KAccountSecurity.PASSWORD_BLOCK_TITLE')"
          :text="$t('KAccountSecurity.PASSWORD_BLOCK_TEXT')"
          :action="$t('KAccountSecurity.PASSWORD_BLOCK_ACTION')"
          @action-triggered="onChangePassword" />
      </div>
      <!--
        Change email
      -->
      <div class="col-12">
        <k-block
          color="orange"
          :title="$t('KAccountSecurity.EMAIL_BLOCK_TITLE')"
          :text="$t('KAccountSecurity.EMAIL_BLOCK_TEXT', { email })"
          :action="$t('KAccountSecurity.EMAIL_BLOCK_ACTION')"
          @action-triggered="onChangeEmail" />
      </div>
      <!--
        Devices
      -->
      <div class="col-12" v-if="hasDevices">
        <k-account-devices />
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
  props: {
    email: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      hasDevices: false
    }
  },
  methods: {
    onChangePassword () {
      this.$router.push({name: 'change-password'})
    },
    onChangeEmail () {
      this.$router.push({name: 'send-change-identity'})
    }
  },
  created () {
    // Load the required components
    this.$load('account/KAccountDevices')()
    .then(component => {
      this.hasDevices = true
      this.$options.components['k-account-devices'] = component
    })
    .catch(() => {
      this.hasDevices = false
    })
  }
}
</script>