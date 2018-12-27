<template>
  <q-item>
    <!--
      Avatar section
    -->
    <slot name="avatar">
    </slot>
    <!--
      Text section
    -->
    <q-item-main>
      <slot name="label">
        <q-item-tile label>{{ name }}</q-item-tile>
      </slot>
      <slot name="sublabel">
        <q-item-tile sublabel>{{ description }}</q-item-tile>
      </slot>
    </q-item-main>
    <!--
      Actions section
    -->
    <slot name="actions">
      <q-item-side v-if="actions.length > 1" right icon="more_vert">
        <q-popover>
          <q-list link>
            <q-item v-for="action in itemActions" :key="action">
              <q-item-main :label="action.label" @click="onActionTriggered(action, item)" />
            </q-item>
          </q-list>
        </q-popover>
      </q-item-side>
    </slot>
  </q-item>
</template>

<script>
import { QList, QItem, QItemSide, QItemMain, QItemTile, QBtn, QIcon, QPopover } from 'quasar'
import mixins from '../../mixins'

export default {
  name: 'k-item',
  mixins: [mixins.baseItem],
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
    itemActions: {
      type: Object,
      required: true
    },
    options: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  computed: {
    name () {
      // Check for custom name field
      return (this.options.nameField ? _.get(this.item, this.options.nameField, '') : this.item.name)
    },
    description () {
      // Check for custom description field
      return this.options.descriptionField ? _.get(this.item, this.options.descriptionField, '') : this.item.description
    }
  }
}
</script>
