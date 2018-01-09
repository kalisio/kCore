<template>
  <div>
    <q-chip color="tertiary">{{name}}</q-chip>
  </div>
</template>

<script>
import { QChip } from 'quasar'
import mixins from '../../mixins'

export default {
  name: 'k-chip-item',
  mixins: [mixins.baseItem],
  components: {
    QChip
  }
}
</script>
