<template>
  <div>
    <!-- 
      Page section
    -->
    <div v-if="name !== ''" class="row items-center justify-center full-width">
      <k-block class="col-10"
        color="red" 
        title="Delete my account ?"
        :text="`Please note that deleting \'${name}\' will delete any data attached to this account.`"
        action="Delete"
        @action-triggered="deletionClicked" />
    </div>
    <!-- 
      Modal section
     -->
     <k-modal ref="confirmModal" :title="`Are you sure you want to delete \'${name}\' ?`">
      <div slot="modal-content" class="column">
        <div>
          <q-input v-model="confirmName" float-label="Enter this account's name to confim" />
        </div>
        <div class="self-end" style="padding: 8px">
          <q-btn @click="deletionConfirmed" :disable="confirmName !== name" color="primary">Delete</q-btn>
        </div>
      </div>
     </k-modal>
  </div>
</template>

<script>
import { QInput, QBtn } from 'quasar'
import mixins from '../../mixins'

export default {
  name: 'k-identity-dz',
  components: {
    QInput,
    QBtn
  },
  mixins: [
    mixins.objectProxy
  ],
  data () {
    return {
      name: '',
      confirmName: ''
    }
  },
  methods: {
    getService () {
      return this.$api.getService('users')
    },
    deletionClicked () {
      this.$refs.confirmModal.open()
    },
    deletionConfirmed () {
      this.$refs.confirmModal.close()
    }
  },
  created () {
    // Load the components
    let loadComponent = this.$store.get('loadComponent')
    this.$options.components['k-block'] = loadComponent('frame/KBlock')
    this.$options.components['k-modal'] = loadComponent('frame/KModal')
    // Install an object-changed callback
    this.$on('object-changed', _ =>  {
      if (this.getObject()) {
        this.name = this.getObject().name
      } else {
        this.name = ''
      }
    })
  }
}
</script>