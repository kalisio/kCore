<template>
  <q-collapsible :icon="icon" :label="label" :class="[bgColor, textColor]">
    <template v-for="list in lists">
      <k-link-list :name="list" />
    </template>   
  </q-collapsible>
</template>

<script>
import { QCollapsible } from 'quasar'
import KLinkList from './KLinkList.vue'

export default {
  name: 'k-link-group',
  components: {
    QCollapsible,
    KLinkList
  },
  dependencies: ['store'],
  props: {
    name: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      label: ''
    }
  },
  created () {
    let Store = this.store()
    // Load the configuration
    let confPath = 'config.' + this.name
    this.icon = Store.get(confPath + '.icon', '')
    this.label = Store.get(confPath + '.label', this.name)
    this.bgColor = Store.get(confPath + '.bgColor', 'bg-light')
    this.textColor = Store.get(confPath + '.textColor', 'text-dark')
    this.lists = Store.get(confPath + '.content', [])
  }
}
</script>
