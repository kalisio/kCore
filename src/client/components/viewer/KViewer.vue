<template>
  <div class="column justify-center full-width">
    <!--
      Form section
    -->
    <div>
      <k-view ref="view" :schema="schema"/>
    </div>
  </div>
</template>

<script>
import { QBtn } from 'quasar'
import { KView } from '../view'
import mixins from '../../mixins'

console.log('je suis là', KView)
export default {
  name: 'k-viewer',
  components: {
    QBtn,
    KView
  },
  mixins: [
    mixins.service,
    mixins.objectProxy,
    mixins.schemaProxy,
    mixins.baseViewer(['view']),
    mixins.refsResolver(['view'])
  ],
  watch: {
    '$route' (to, from) {
      // React to route changes but reusing the same component as this one is generic
      this.refresh()
    }
  },
  created () {
    this.refresh()
  }
}
</script>
