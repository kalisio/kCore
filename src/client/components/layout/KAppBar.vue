<template>
  <q-toolbar>
    <!--
      SideNav menu
     -->
    <q-btn id="sidenav-menu" flat @click="$emit('menu-clicked')">
      <q-icon name="menu" />
    </q-btn>
    <!-- 
      Title/subtitle section
     -->
    <q-toolbar-title>
      {{ appBar.title }}
      <span slot="subtitle">
        {{ appBar.subtitle }}
      </span>
    </q-toolbar-title>
    <!--
      Toolbar section
     -->
    <template v-for="action in appBar.toolbar">
      <q-btn :id ="action.name" :key="action.name" flat @click="$router.push(action.route)">
        <q-icon :name="action.icon" />
      </q-btn>
    </template>
    <!--
      Menu section
     -->
    <template v-if="appBar.menu && appBar.menu.length > 0">
      <q-btn id="actions-menu" flat>
        <q-icon name="more_vert">
          <q-popover ref="menu">
            <q-list>
              <template v-for="action in appBar.menu">
                <q-item :id="action.name" :key="action.name" link  @click="$router.push(action.route), $refs.menu.close()">
                  <q-item-side :icon="action.icon" />
                  <q-item-main>
                    {{action.label}}
                  </q-item-main>
                </q-item>
              </template>
            </q-list>
          </q-popover>
        </q-icon>
      </q-btn>
    </template>
    <!-- 
      Voice ?
     -->
    <!--k-voice v-if="appBar.isVoiceEnabled" /-->
  </q-toolbar>
</template>

<script>
import { Events, QToolbar, QToolbarTitle, QBtn, QIcon, QList, QItem, QItemSide, QItemMain, QPopover } from 'quasar'
import KVoice from './KVoice.vue'

export default {
  name: 'k-app-bar',
  components: {
    QToolbar,
    QToolbarTitle,
    QBtn,
    QIcon,
    QList,
    QItem,
    QItemSide,
    QItemMain,
    QPopover,
    KVoice
  },
  data () {
    return {
      appBar: this.$store.get('appBar')
    }
  },
  created () {
    // Load the required components
    this.appBar.title = this.$config('appName')
  }
}
</script>
