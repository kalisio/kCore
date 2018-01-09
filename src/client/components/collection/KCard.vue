<template>
  <q-card>
    <!--
      Title section
    -->
    <slot name="card-title"> 
      <div v-if="options.avatar">
        <q-card-media>
          <div class="row justify-center" style="padding:8px">
            <avatar v-if="name" :username="name" :size="options.avatar.size" />
          </div>
          <q-card-title slot="overlay">
            {{name}}
            <span slot="subtitle">{{description}}</span>
            <div slot="right">
              <slot name="card-icon"></slot>
            </div>
          </q-card-title>
        </q-card-media>
      </div>
      <div v-else>
        <q-card-title slot="overlay">
          {{name}}
          <span slot="subtitle">{{description}}</span>
          <div slot="right">
            <slot name="card-icon"></slot>
          </div>
        </q-card-title>
      </div>
    </slot>
    <!--
      Content section
    -->
    <q-card-main>
      <slot name="card-content"></slot>
    </q-card-main>
    <!--
      Actions section
    -->
    <q-card-separator />
    <slot name="card-actions">
      <q-card-actions align="end">
        <template v-for="(action, index) in itemActions">
          <q-btn flat round small color="primary" :key="index" :icon="action.icon" @click="onActionTriggered(action, item)" />
        </template>
      </q-card-actions>
    </slot>
  </q-card>
</template>

<script>
import { QCard, QCardTitle, QCardActions, QCardSeparator, QCardMain, QCardMedia, QBtn } from 'quasar'
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
    QCardMedia,
    QBtn,
    Avatar
  }
}
</script>
