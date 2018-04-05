<template>
  <div class="row justify-center items-center window-height window-width">
    <div style="width: 540px">
      <!--
        Header section
      -->
      <div>
        <k-screen-header />
      </div>
      <!--
        Frame section
      -->
      <q-card>
        <!-- 
          Title section 
        -->
        <q-card-title>
          <slot name="screen-title">
            <h5>{{title}}</h5>
          </slot>
          <slot name="screen-subtitle">
            <div>
              {{subtitle}}
            </div>
          </slot>
        </q-card-title>
        <!-- 
          Content section 
        -->
        <q-card-main>
          <slot name="screen-content" />
        </q-card-main>
      </q-card>
      <!-- 
        Footer section
      -->
      <div>
        <k-screen-footer />
      </div>
    </div>
  </div>
</template>

<script>
import { QCard, QCardTitle, QCardMain, QBtn } from 'quasar'

export default {
  name: 'k-screen',
  components: {
    QCard,
    QCardTitle,
    QCardMain,
    QBtn
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    subtitle: {
      type: String,
      default: ''
    }
  },
  created () {
    this.$options.components['k-screen-header'] = this.$load('frame/KScreenHeader')
    this.$options.components['k-screen-footer'] = this.$load('frame/KScreenFooter')
  }
}
</script>
