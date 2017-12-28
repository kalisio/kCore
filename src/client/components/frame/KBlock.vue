<template>
  <q-card>
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
      <div id="k-block-main" class="row justify-between items-center">
        <!-- Content -->
        <div :class="textWidth" v-html="text" />
        <!-- Action -->
        <template v-if="action !== ''">
          <div :class="buttonWidth">
            <div class="row justify-center">
              <q-btn @click="$emit('action-triggered', action)" :color="color" :disable="disable">{{action}}</q-btn>
            </div>
          </div>
        </template>
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
    disable: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    titleColors () {
      return ['text-' + this.color, 'bg-' + this.color + '-2']
    },
    textWidth () {
      return this.action === '' ? 'col-12' : 'col-9'
    },
    buttonWidth () {
      return 'col-2'
    }
  }
}
</script>

<style>
#k-block-main {
  padding: 16px;
}
</style>