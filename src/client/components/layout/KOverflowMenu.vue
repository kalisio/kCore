<template>
  <q-btn v-if="actions.length > 0" id="overflow-menu-entry" icon="more_vert" :color="color" flat round :dense="dense">
    <q-menu id="overflow-menu" v-model="isVisible">
      <q-list :dense="dense">
        <template v-for="action in actions">
          <q-item :id="action.name" :key="key(action)" clickable @click="onActionTriggered(action)">
            <q-item-section avatar>
              <q-icon :dense="dense" :name="action.icon" />
            </q-item-section>
            <q-item-section>
              {{action.label}}
            </q-item-section>
          </q-item>
        </template>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script>
import { uid } from 'quasar'

export default {
  name: 'k-overflow-menu',
  props: {
    actions: {
      type: Array,
      default: () => { return [] }
    },
    context: {
      type: Object,
      default: () => { return null }
    },
    color: {
      type: String,
      default: 'primary'
    },
    dense: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isVisible: false
    }
  },
  methods: {
    key (action) {
      return action.name + '-' + uid()
    },
    onActionTriggered (action) {
      this.isVisible = false
      // If a handler is given call it
      if (action.handler) action.handler(this.context)
      // If a route is given activate it
      else if (action.route) this.$router.push(action.route)
    }
  }
}
</script>
