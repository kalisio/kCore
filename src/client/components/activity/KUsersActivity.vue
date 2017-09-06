<template>
  <div v-if="operation === 'edit'">
    <k-editor :context="context" service="users" :id="id" :perspective="perspective" />
  </div>
  <div v-else>
    <k-grid :context="context" service="users" :actions="userItemActions()" />
    <k-fab :actions="userActions()" />
  </div>
</template>

<script>
import mixins from '../../mixins'

export default {
  name: 'k-groups-activity',
  mixins: [
    mixins.baseActivity,
    mixins.userActions
  ],
  props: {
    context: {
      type: String,
      default: ''
    },
    operation: {
      type: String,
      default: '',
    },
    id : {
      type: String,
      default: '',
    },
    perspective: {
      type: String,
      default: ''
    }
  },
  methods: {
    userActions () {
      return this.filterActions(['addMember'])
    },
    userItemActions () {
      return this.filterActions(['editUser', 'removeMember'])
    }
  },
  created () {
    // Load the required components
    let loadComponent = this.$store.get('loadComponent')
    this.$options.components['k-editor'] = loadComponent('editor/KEditor')
    this.$options.components['k-grid'] = loadComponent('collection/KGrid')
    this.$options.components['k-fab'] = loadComponent('collection/KFab')
  }
}
</script>