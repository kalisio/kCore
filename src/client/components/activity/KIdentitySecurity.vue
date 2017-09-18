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
          :text="`Blah blah`"
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
          :text="`Blah blah`"
          action="Change email"
          @action-triggered="onChangeEmail" />
      </div>
    </div>
  </div>
</template>

<script>
import { KBlock } from '../frame'
import mixins from '../../mixins'

export default {
  name: 'k-identity-security',
  components: {
    KBlock
  },
  mixins: [
    mixins.objectProxy
  ],
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
  },
  created () {
    // Install an object-changed callback
    this.$on('object-changed', _ =>  {
      if (this.getObject()) {
        // TODO
      }
    })
  }
}
</script>