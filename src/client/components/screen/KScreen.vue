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
          <slot name="title">
            <h5>{{title}}</h5>
          </slot>
          <div slot="subtitle">
            {{subtitle}}
          </div>
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
    let loadComponent = this.$store.get('loadComponent')
    this.$options.components['k-screen-header'] = loadComponent(this.$store.get('screen.header', 'screen/KScreenHeader'))
    this.$options.components['k-screen-footer'] = loadComponent(this.$store.get('screen.footer', 'screen/KScreenFooter'))
    // setup the color schema
    this.color = this.$store.get('screen.color', 'bg-white')
    this.textColor = this.$store.get('screen.textColor', 'text-dark')
    this.bgColor = this.$store.get('screen.bgColor', 'bg-light')
    this.bgTextColor = this.$store.get('screen.bgTextColor', 'text-dark')
  }
}
</script>
