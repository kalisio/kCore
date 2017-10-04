<template>
  <div class="column" :class="[bgColor, textColor]">
    <!--
      User avatar
    -->
    <div class="self-center" style="padding: 16px">
      <avatar :username="name" :size="72" />
    </div>
    <!--
      User information
    -->
    <div>
      <q-list highlight no-border>
        <q-side-link item :to="{ name: 'account-activity', params: { perspective: 'profile' }}">
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
      id: ''
    }
  },
  methods: {
    refreshIdentity () {
      this.name = this.$store.get('user.name', '')
      this.id = this.$store.get('user._id', '')
    }
  },
  created () {
    // Load the configuration
    let confPath = 'config.' + this.name
    this.bgColor = this.$store.get(confPath + '.bgColor', 'bg-dark')
    this.textColor = this.$store.get(confPath + '.textColor', 'text-white')
    this.iconColor = this.$store.get(confPath + '.iconColor', 'white')
    // Update the panel
    this.refreshIdentity()
  },
  mounted () {
    Events.$on('user-changed', user => {
      this.refreshIdentity ()
    })
    Events.$on('user-patched', user => {
      this.refreshIdentity ()
    })
  }
}
</script>
