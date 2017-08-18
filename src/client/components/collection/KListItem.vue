<template>
  
  <q-item>
    <!--
      Icon section
    -->
    <slot name="avatar">
    </slot>
    <!--
      Text section
    -->
    <q-item-main>
      <slot name="label">
        <q-item-tile label>{{ item.name }}</q-item-tile>
      </slot>
      <slot name="sublabel">
        <q-item-tile sublabel>{{ item.description }}</q-item-tile>
      </slot>
    </q-item-main>
    <!--
      Actions section
    -->
    <slot name="actions">
      <q-item-side v-if="actions.length > 1" right icon="more_vert">
        <q-popover>
          <q-list link>
            <q-item v-for="action in actions" :key="action">
              <q-item-main :label="action.label" @click="$emit('actionTrigerred', action.handler, item)" />
            </q-item>
          </q-list>
        </q-popover>
      </q-item-side>
    </slot>
  </q-item>
</template>

<script>
import { QList, QItem, QItemSide, QItemMain, QItemTile, QBtn, QIcon, QPopover } from 'quasar'

export default {
  name: 'k-list-item',
  components: {
    QList,
    QItem,
    QItemSide,
    QItemMain,
    QItemTile,
    QBtn,
    QIcon,
    QPopover
  },
  props: {
    item: {
      type: Object,
      required: true
    },
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
