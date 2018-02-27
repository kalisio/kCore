<template>
  <div class="column" :class="[bgColor, textColor]">
    <!--
      User avatar
    -->
    <div class="self-center" style="padding: 16px">
      <avatar :username="name" :src="avatar" :size="72" />
    </div>
    <!--
      User information
    -->
    <div>
      <q-list highlight no-border>
        <q-side-link id="account" item :to="{ name: 'account-activity', params: { perspective: 'profile' }}">
          <q-item-main :label="name" />
          <q-item-side icon="perm_identity" :color="iconColor" right />
        </q-side-link>
      </q-list>
    </div>
  </div>
</template>

<script>
import { Events, QList, QSideLink, QItemSide, QItemMain } from 'quasar'
import Avatar from 'vue-avatar/dist/Avatar'

export default {
  name: 'k-identity-panel',
  components: {
    QList, 
    QSideLink, 
    QItemSide, 
    QItemMain,
    Avatar
  },
  data () {
    return {
      name: '',
      id: '',
      avatar: ''
    }
  },
  methods: {
    async refreshIdentity () {
      this.name = this.$store.get('user.name', '')
      this.id = this.$store.get('user._id', '')
      // This field indicates that the avatar has been set
      let avatar = this.$store.get('user.avatar', '')
      if (avatar) {
        // Then we need to fetch it
        avatar = await this.$api.getService('storage').get(avatar._id)
        // Get as data URI
        this.avatar = avatar.uri
      }
    }
  },
  created () {
    // Load the configuration
    this.bgColor = this.$config(this.name + '.bgColor', 'bg-dark')
    this.textColor = this.$config(this.name + '.textColor', 'text-white')
    this.iconColor = this.$config(this.name + '.iconColor', 'white')
    // Update the panel
    this.refreshIdentity()
    Events.$on('user-changed', this.refreshIdentity)
  },
  beforeDestroy() {
    Events.$off('user-changed', this.refreshIdentity)
  }
}
</script>
