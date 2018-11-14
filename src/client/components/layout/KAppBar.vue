<template>
  <q-toolbar v-if="appBar.title!=''">
    <!--
      SideNav toggle
     -->
    <q-btn id="side-nav-toggle" v-if="hasSideNavToggle" flat @click="$emit('side-nav-toggled')">
      <q-icon name="menu" />
    </q-btn>
    <!-- 
      Title/subtitle section
     -->
    <q-toolbar-title id="app-bar-title">
      {{ appBar.title }}
      <span slot="subtitle">
        {{ appBar.subtitle }}
      </span>
    </q-toolbar-title>
    <!--
      Toolbar section
     -->
    <template v-if="hasToolbar" v-for="action in appBar.toolbar">
      <q-btn :id ="action.name" :key="action.name" flat @click="onActionTriggered(action)">
        <q-icon :name="action.icon" />
      </q-btn>
    </template>
    <!--
      Menu section
     -->
    <template v-if="hasMenu">
      <q-btn id="overflow-menu-entry" flat>
        <q-popover id="overflow-menu" ref="menu">
          <q-list>
            <template v-for="action in appBar.menu">
              <q-item :id="action.name" :key="action.name" link @click="onActionTriggered(action)">
                <q-item-side :icon="action.icon" />
                <q-item-main>
                  {{action.label}}
                </q-item-main>
              </q-item>
            </template>
          </q-list>
        </q-popover>
        <q-icon name="more_vert"></q-icon>
      </q-btn>
    </template>
  </q-toolbar>
</template>

<script>
import { QToolbar, QToolbarTitle, QBtn, QIcon, QList, QItem, QItemSide, QItemMain, QPopover } from 'quasar'

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
    QPopover
  },
  props: {
    hasSideNavToggle: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      appBar: this.$store.get('appBar')
    }
  },
  computed: {
    hasToolbar () {
      return this.appBar.toolbar && this.appBar.toolbar.length > 0
    },
    hasMenu () {
      return this.appBar.menu && this.appBar.menu.length > 0
    }
  },
  methods: {
    onActionTriggered (action) {
      if (this.hasMenu) this.$refs.menu.close()
      // If a handler is given call it
      if (action.handler) action.handler()
      // If a route is given activate it
      else if (action.route) this.$router.push(action.route)
    }
  }
}
</script>
