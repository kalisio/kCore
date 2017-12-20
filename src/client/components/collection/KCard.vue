<template>
  <q-card>
    <!--
      Content section
    -->
    <q-card-main class="bg-light">
      <q-item>
        <q-item-side><avatar v-if="name" :username="name" :size="36" /></q-item-side>
        <q-item-main>
          <q-item-tile label>{{ name }}</q-item-tile>
          <q-item-tile sublabel>{{ description }}</q-item-tile>
        </q-item-main>
        <q-item-side right v-if="tags">
          <q-item-tile v-if="tag.icon" v-for="tag in tags" :icon="tag.icon" color="primary" />
        </q-item-side>
      </q-item>
    </q-card-main>
    <!--
      Actions section
    -->
    <q-card-separator />
    <q-card-actions align="end">
      <template v-for="action in itemActions">   
        <q-btn flat round small color="primary" :icon="action.icon" @click="onActionTriggered(action, item)" />
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
  mixins: [mixins.baseItem],
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
