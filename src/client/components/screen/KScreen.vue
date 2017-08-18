<template>
  <div class="row justify-center items-center window-height window-width" :class="[bgColor, bgTextColor]">
    <div style="width: 480px">
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
  dependencies: ['store'],
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
    let Store = this.store()
    // Retrieve the loadComponent function and load the components
    // We need this so that we can dynamically load the component
    // with a function that has previously been statically analyzed by the bundler (eg webpack)
    let loadComponent = Store.get('loadComponent')
    this.$options.components['k-screen-header'] = loadComponent(Store.get('screen.header', 'screen/KScreenHeader'))
    this.$options.components['k-screen-footer'] = loadComponent(Store.get('screen.footer', 'screen/KScreenFooter'))
    // setup the color schema
    this.color = Store.get('screen.color', 'bg-white')
    this.textColor = Store.get('screen.textColor', 'text-dark')
    this.bgColor = Store.get('screen.bgColor', 'bg-light')
    this.bgTextColor = Store.get('screen.bgTextColor', 'text-dark')
  }
}
</script>
