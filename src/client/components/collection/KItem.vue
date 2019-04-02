<template>
  <q-item @click="onItemSelected">
    <!--
      Avatar section
    -->
    <slot name="item-icon">
      <!-- TODO figure out how to 'translate' this to Quasar v1 - choices below may be incorrect -->
      <q-item-section avatar v-if="options.icon">
         <q-icon :color="options.color" :name="options.icon" />
      </q-item-section>
    </slot>
    <slot name="item-avatar">
      <!-- TODO figure out how to 'translate' this to Quasar v1 - choices below may be incorrect -->
      <q-item-section avatar v-if="options.avatar">
         <q-avatar :icon="options.avatar" />
      </q-item-section>
    </slot>
    <!--
      Content section
    -->
    <slot name="item-content">
      <q-item-label>
        <slot name="item-label">
          <q-item-label header>{{ name }}</q-item-label>
        </slot>
        <slot name="item-sublabel">
          <q-item-label caption>{{ description }}</q-item-label>
        </slot>
      </q-item-label>
    </slot>
    <!--
      Actions section
    -->
    <slot name="item-actions">
      <!-- TODO figure out how to 'translate' this to Quasar v1 - choices below are probably incorrect -->
      <!-- <q-item-section v-if="itemActions.length > 0" right icon="more_vert"> -->
      <q-item-section v-if="itemActions.length > 0" side >
        <!-- TODO figure out how to 'translate' this to Quasar v1 -->
        <q-icon name="more_vert" />

        <q-menu>
          <q-list link>
            <q-item v-for="action in itemActions" :key="key(action, 'label')">
              <q-item-label @click="onActionTriggered(action, item)">{{ action.label }}</q-item-label>
            </q-item>
          </q-list>
        </q-menu>
      </q-item-section>
    </slot>
  </q-item>
</template>

<script>
import _ from 'lodash'
import { QList, QItem, QItemSection, QItemLabel, QIcon, QAvatar, QBtn, QMenu } from 'quasar'
import mixins from '../../mixins'

export default {
  name: 'k-item',
  mixins: [mixins.baseItem],
  components: {
    QList,
    QItem,
    QItemSection,
    QItemLabel,
    QIcon,
    QAvatar,
    QBtn,
    QMenu
  },
  props: {
    item: {
      type: Object,
      required: true
    },
    itemActions: {
      type: Array,
      default: () => { return [] }
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
  },
  methods: {
    key (object, property) {
      return this.item._id + '-' + object[property]
    },
    onItemSelected () {
      this.$emit('item-selected', this.item)
    },
    onActionTriggered (action, item) {
      // If a handler is given call it
      if (action.handler) action.handler.call(this, item)
      // If a route is given activate it
      else if (action.route) this.$router.push(action.route)
    }
  }
}
</script>
