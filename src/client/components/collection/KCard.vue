<template>
  <q-card>
    <!--
      Content section
    -->
    <q-card-main class="bg-light">
      <q-item>
        <q-item-side><avatar :username="item.name" :size="36" /></q-item-side>
        <q-item-main>
          <q-item-tile label>{{ item.name }}</q-item-tile>
          <q-item-tile sublabel>{{ item.description }}</q-item-tile>
        </q-item-main>
      </q-item>
    </q-card-main>
    <!--
      Actions section
    -->
    <q-card-separator />
    <q-card-actions>
      <template v-for="action in actions">   
        <q-btn flat color="primary" :icon="action.icon" @click="onActionTriggered(action.handler, item)">
          <small>{{ action.label }}</small>
        </q-btn>
      </template>
    </q-card-actions>
  </q-card>
</template>

<script>
import { QCard, QCardTitle, QCardActions, QCardSeparator, QCardMain, QItem, QItemMain, QItemTile, QItemSide, QBtn } from 'quasar'
import Avatar from 'vue-avatar/dist/Avatar'
import mixins from '../../mixins'

export default {
  name: 'k-card',
  mixins: [mixins.item],
  components: {
    QCard,
    QCardTitle,
    QCardActions,
    QCardSeparator,
    QCardMain,
    QItem,
    QItemMain,
    QItemTile,
    QItemSide,
    QBtn,
    Avatar
  }
}
</script>
