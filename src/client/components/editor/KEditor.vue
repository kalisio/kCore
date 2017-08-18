<template>
  <div class="column justify-center" style="padding: 36px">
    <k-form
      ref="form"
      :schema="schema"
      submit-button="Save" 
      @submitted="onSubmitted" />
  </div>
</template>

<script>
import { KForm } from '../form'

export default {
  name: 'k-editor',
  components: {
    KForm,
  },
  dependencies: ['api', 'store'],
  props: {
    parameters: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      submitButton: 'Create',
      schema: {},
      item: {}
    }
  },
  methods: {
    onSubmitted (values) {
      // Update the item perspective
      if (this.id) {
        // Edition mode => patch the item
        // Do we need to patch a perspective of the item ?
        if (_.has(this.parameters, 'perspective')) {
          this.item[this.parameters.perspective] = values
        } else {
          // Patch the entire item
          this.item = values
        }
        this.service.patch(this.id, this.item)
      }
      else {
        // Creation mode => create the item
        this.service.create(this.item)
      }
    }
  },
  watch: {
    item: function (values) {
      if (_.has(this.parameters, 'perspective')) {
        this.$refs.form.fill(values[this.parameters.perspective])
      } else {
        this.$refs.form.fill(values)
      }
    }
  },
  created () {
    let Store = this.store()
    // Retrieve the schema to build the form
    this.schema =  require('./' + this.parameters.schema + '.json')
    // Retrieve the service
    this.service = this.api().getService(this.parameters.service)
    // Retrieve the id using the Store
    this.id = Store.get(this.parameters.id)
    // Do we need to get the item ?
    if (this.id)  {
      // Do we need to apply a selection using a specified perspective ?
      let selection = []
      if (_.has(this.parameters, 'perspective')) {
        selection.push(this.parameters.perspective)
      }
      this.service.get(this.id, { query: { $select: selection } } )
      .then(item => {
        this.item = item
      })
    }
  }
}
</script>
