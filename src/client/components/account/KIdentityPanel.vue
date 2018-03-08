<template>
  <div class="column" :class="[bgColor, textColor]">
    <!--
      User avatar
    -->
    <div class="self-center" style="padding: 16px">
      <avatar v-if="!avatarImage" :username="name" :size="72" />
      <avatar v-if="avatarImage" :username="name" :src="avatarImage" :size="72" />
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
      avatarImage: ''
    }
  },
  methods: {
    async refreshIdentity () {
      this.name = this.$store.get('user.name', '')
      this.id = this.$store.get('user._id', '')
      // This field indicates that the avatar has been set
      let avatarId = this.$store.get('user.avatar._id', '')
      if (avatarId) {
        // Then we need to fetch it from global storage service
        const data = await this.$api.getService('storage').get(avatarId + '.thumbnail')
        // Get as data URI
        this.avatarImage = data.uri
      } else {
        this.avatarImage = ''
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
