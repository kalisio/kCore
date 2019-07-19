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
        <q-item id="account" @click="onClickAccount" clickable v-ripple>
          <!-- TODO figure out how to 'translate' this to Quasar v1 - choices below may be incorrect -->
          <q-item-section>
            <q-item-label>{{ name }}</q-item-label> />
          </q-item-section>
          <!-- TODO figure out how to 'translate' this to Quasar v1 - choices below may be incorrect -->
          <!-- <q-item-side icon="perm_identity" right /> -->
          <q-item-section avatar >
              <q-icon name="perm_identity" />
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script>
import { QList, QItem, QItemSection, QItemLabel } from 'quasar'
import { Avatar } from 'vue-avatar'

export default {
  name: 'k-identity-panel',
  components: {
    QList,
    QItem,
    QItemSection,
    QItemLabel,
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
    },
    onClickAccount () {
      this.$router.push({ name: 'account-activity', params: { perspective: 'profile' } })
    }
  },
  created () {
    this.refreshIdentity()
    this.$events.$on('user-changed', this.refreshIdentity)
  },
  beforeDestroy () {
    this.$events.$off('user-changed', this.refreshIdentity)
  }
}
</script>
