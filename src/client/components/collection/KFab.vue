<template>
  <div>
     <!-- 
      Render an expandable fab if multiple actions are provided
     -->
    <q-fab v-if="actions.length > 1" 
      icon="keyboard_arrow_up" 
      direction ="up" 
      color="primary">
        <q-fab-action 
          v-for="action in actions" 
          :key="action.id"
          color="secondary"
          @click="$emit('actionTrigerred', action.handler)"
          :icon="action.icon">
        </q-fab-action>
    </q-fab>
    <!-- 
      Render a non expandable fab if a single action is provided
     -->
    <q-btn v-else-if="actions.length === 1" round 
      color="primary"
      class="fixed"
      @click="$emit('actionTrigerred', actions[0].handler)"
      style="right: 18px; bottom: 18px">
      <q-icon :name="actions[0].icon" />
    </q-btn>
  </div>
</template>

<script>
import { QBtn, QIcon, QFab, QFabAction } from 'quasar'

export default {
  name: 'k-fab',
  components: {
    QBtn,
    QIcon,
    QFab,
    QFabAction
  },
  props: {
    actions: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
    }
  }
}
</script>
