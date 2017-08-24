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
    // Load the configuration
    let confPath = 'config.' + this.name
    this.icon = this.$store.get(confPath + '.icon', '')
    this.label = this.$store.get(confPath + '.label', this.name)
    this.bgColor = this.$store.get(confPath + '.bgColor', 'bg-light')
    this.textColor = this.$store.get(confPath + '.textColor', 'text-dark')
    this.lists = this.$store.get(confPath + '.content', [])
  }
}
</script>
