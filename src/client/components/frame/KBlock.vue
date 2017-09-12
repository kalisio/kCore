<template>
  <q-card>
    <q-card-title v-if="title !== ''" :class="titleColors">
      {{title}}
    </q-card-title>
    <q-card-main>
      <div id="k-card-main" class="row justify-between items-center">
        <div>
          {{text}}
        </div>
        <div v-if="action !== ''">
          <q-btn @click="$emit('action-triggered', action)" :color="color">{{action}}</q-btn>
        </div>
      </div>
    </q-card-main>
  </q-card>
</template>

<script>
import { QCard, QCardTitle, QCardMain, QBtn } from 'quasar'

export default {
  name: 'k-block',
  components: {
    QCard,
    QCardTitle,
    QCardMain,
    QBtn
  },
  props: {
    color: {
      type: String,
      default: 'grey'
    },
    title: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    },
    action: {
      type: String,
      default: ''
    }
  },
  computed: {
    titleColors () {
      return ['text-' + this.color, 'bg-' + this.color + '-2']
    }
  }
}
</script>

<style>
#k-card-main {
  padding: 16px;
}
</style>