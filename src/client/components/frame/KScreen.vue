<template>
  <div class="row justify-center items-center window-height window-width" :class="[bgColor, bgTextColor]">
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
      <q-card :class="[color, textColor]">
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
  data () {
    return {
      bgColor: '',
      bgTextColor: '',
      color: '',
      textColor: ''
    }
  },
  created () {
    // Retrieve the loadComponent function and load the components
    // We need this so that we can dynamically load the component
    // with a function that has previously been statically analyzed by the bundler (eg webpack)
    this.$options.components['k-screen-header'] = this.$load(this.$config('screen.header', 'frame/KScreenHeader'))
    this.$options.components['k-screen-footer'] = this.$load(this.$config('screen.footer', 'frame/KScreenFooter'))
    // setup the color schema
    this.color = this.$config('screen.color', 'bg-white')
    this.textColor = this.$config('screen.textColor', 'text-dark')
    this.bgColor = this.$config('screen.bgColor', 'bg-light')
    this.bgTextColor = this.$config('screen.bgTextColor', 'text-dark')
  }
}
</script>
