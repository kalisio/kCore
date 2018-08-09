<template>
  <q-card class="k-block">
    <!-- 
      Title section
     -->
    <q-card-title v-if="title !== ''" :class="titleColors">
      {{title}}
    </q-card-title>
    <!-- 
      Frame section
      -->
    <q-card-main>
      <div class="row justify-between k-block-content">
        <!-- Text -->
        <div class="col-xs-12 col-sm-10 k-block-text" v-html="text" />
        <!-- Action -->
        <div v-if="action !== ''" class="col-xs-12 col-sm-2 self-center" align="right">
          <q-btn @click="$emit('action-triggered', action)" :color="color" :disabled="disabled">{{action}}</q-btn>
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
    },
    disabled: {
      type: Boolean,
      default: false
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
.k-block {
  padding: 8px;
}
.k-block-content {
  margin: 8px;
}
.k-block-text {
  padding: 8px;
}
</style>