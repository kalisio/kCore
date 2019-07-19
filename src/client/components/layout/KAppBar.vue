<template>
  <q-toolbar v-if="appBar.title!=''">
    <!--
      SideNav toggle
     -->
    <q-btn id="left-drawer-toggle" v-if="hasLeftDrawerToggle" flat @click="$emit('left-drawer-toggled')">
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
    <template v-if="hasToolbar">
      <template v-for="action in appBar.toolbar">
        <q-btn :id ="action.name" :key="action.name" flat @click="onActionTriggered(action)">
          <q-icon :name="action.icon" />
          <q-tooltip>
            {{ action.label }}
          </q-tooltip>
        </q-btn>
      </template>
    </template>
    <!--
      Menu section
     -->
    <template v-if="hasMenu">
      <q-btn id="overflow-menu-entry" flat>
        <q-menu id="overflow-menu" ref="menu">
          <q-list>
            <template v-for="action in appBar.menu">
              <q-item :id="action.name" :key="action.name" link @click="onActionTriggered(action)">
                <!-- TODO figure out how to 'translate' this to Quasar v1 - choices below may be incorrect -->
                <!-- <q-item-side :icon="action.icon" /> -->
                <q-item-section avatar >
                  <q-icon :name="action.icon" />
                </q-item-section>
                <q-item-label>
                  {{action.label}}
                </q-item-label>
              </q-item>
            </template>
          </q-list>
        </q-menu>
        <q-icon name="more_vert"></q-icon>
      </q-btn>
    </template>
  </q-toolbar>
</template>

<script>
import { QToolbar, QToolbarTitle, QBtn, QIcon, QList, QItem, QItemSection, QItemLabel, QTooltip, QMenu } from 'quasar'

export default {
  name: 'k-app-bar',
  components: {
    QToolbar,
    QToolbarTitle,
    QBtn,
    QIcon,
    QList,
    QItem,
    QItemSection,
    QItemLabel,
    QMenu,
    QTooltip
  },
  props: {
    hasLeftDrawerToggle: {
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
      if (this.hasMenu) this.$refs.menu.hide()
      // If a handler is given call it
      if (action.handler) action.handler()
      // If a route is given activate it
      else if (action.route) this.$router.push(action.route)
    }
  }
}
</script>
