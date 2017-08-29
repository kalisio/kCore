<template>
  <q-card>
    <!--
      Title section
    -->
    <q-card-title class="bg-light">
      <slot name="title">
        <q-item>
          <q-item-side><avatar :username="item.name" :size="36" /></q-item-side>
          <q-item-main :label="item.name" />
        </q-item>
      </slot>
    </q-card-title>
    <!--
      Content section
    -->
    <q-card-main class="bg-light">
      <slot name="content">
        {{ item.description }}
      </slot>
    </q-card-main>
    <!--
      Actions section
    -->
    <q-card-separator />
    <q-card-actions>
      <template v-for="action in actions">   
        <q-btn flat color="primary" :icon="action.icon" @click="$emit('actionTrigerred', action.handler, item)">
          <small>{{ action.label }}</small>
        </q-btn>
      </template>
    </q-card-actions>
  </q-card>
</template>

<script>
import { QCard, QCardTitle, QCardActions, QCardSeparator, QCardMain, QItem, QItemMain, QItemSide, QBtn } from 'quasar'
import Avatar from 'vue-avatar/dist/Avatar'

export default {
  name: 'k-card',
  components: {
    QCard,
    QCardTitle,
    QCardActions,
    QCardSeparator,
    QCardMain,
    QItem,
    QItemMain,
    QItemSide,
    QBtn,
    Avatar
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
