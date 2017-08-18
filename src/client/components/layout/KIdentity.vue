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
        <q-side-link item :to="{ name: route, params: { id: id }}" exact>
          <q-item-main :label="name" />
          <q-item-side icon="perm_identity" :color="iconColor" right />
        </q-side-link>
      </q-list>
    </div>
  </div>
</template>

<script>
import { QList, QSideLink, QItemSide, QItemMain } from 'quasar'
import Avatar from 'vue-avatar/dist/Avatar'

export default {
  name: 'k-identity',
  components: {
    QList, 
    QSideLink, 
    QItemSide, 
    QItemMain,
    Avatar
  },
  dependencies: ['store'],
  data () {
    return {
      name: '',
      id: ''
    }
  },
  created () {
    let Store = this.store()
    // Retrieve the the user info
    this.name = Store.get('user.name')
    this.id = Store.get('user._id')
    // Load the configuration
    let confPath = 'config.' + this.name
    this.bgColor = Store.get(confPath + '.bgColor', 'bg-dark')
    this.textColor = Store.get(confPath + '.textColor', 'text-white')
    this.iconColor = Store.get(confPath + '.iconColor', 'white')
    this.route = Store.get(confPath + '.route', 'profile')
  }
}
</script>
