<template>
  <div class="column">
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
          <q-item-side icon="perm_identity" right />
        </q-side-link>
      </q-list>
    </div>
  </div>
</template>

<script>
import { Events, QList, QItem, QSideLink, QItemSide, QItemMain, QItemSeparator } from 'quasar'
import { Avatar } from 'vue-avatar'

export default {
  name: 'k-identity-panel',
  components: {
    QList,
    QItem,
    QSideLink,
    QItemSide,
    QItemMain,
    QItemSeparator,
    Avatar: Avatar
  },
  data () {
    return {
      name: '',
      avatarImage: ''
    }
  },
  methods: {
    async refreshIdentity () {
      this.name = this.$store.get('user.name', '')
      this.objectId = this.$store.get('user._id', '')
      // This field indicates that the avatar has been set
      let avatarId = this.$store.get('user.avatar._id', '')
      if (avatarId) {
        // Then we need to fetch it from global storage service
        // Force global context as a storage service might also be available as contextual
        const data = await this.$api.getService('storage', '').get(avatarId + '.thumbnail')
        // Get as data URI
        this.avatarImage = data.uri
      } else {
        this.avatarImage = ''
      }
    }
  },
  created () {
    this.refreshIdentity()
    Events.$on('user-changed', this.refreshIdentity)
  },
  beforeDestroy () {
    Events.$off('user-changed', this.refreshIdentity)
  }
}
</script>
