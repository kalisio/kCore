<template>
  <k-dialog ref="dialog" :title="title">
    <!-- 
      Content section
     -->
    <div slot="dialog-content">
      <div v-html="content" />
      <div v-if="prevent">
        <q-input v-model="capturedText" :float-label="prevent.label" />
      </div>
    </div>
    <!--
      Actions section
     -->
    <div slot="dialog-actions">
      <q-btn @click="$emit('confirmed')" :disable="actionDisabled" color="primary">{{action}}</q-btn>
    </div>
  </k-dialog>
</template>

<script>
import { QInput, QBtn } from 'quasar'
import KDialog from './KDialog.vue'

export default {
  name: 'k-confirm',
  components: {
    QInput,
    QBtn,
    KDialog
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    },
    action: {
      type: String,
      default: 'Ok'
    },
    prevent: {
      type: Object,
      default: function () {
        return null
      }
    }
  },
  computed: {
    actionDisabled () {
      if (this.prevent) return this.capturedText !== this.prevent.textToMatch
      return false
    }
  },
  data () {
    return {
      capturedText: ''
    }
  },
  methods: {
    open () {
      this.$refs.dialog.open()
    },
    close () {
      this.$refs.dialog.close()
    }
  }
}
</script>