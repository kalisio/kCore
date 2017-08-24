<template>
  <div class="column justify-center" style="padding: 36px">
    <k-form v-if="schema"
      ref="form"
      :schema="schema"
      :submit-button="mode === 'Editing' ? 'Update':'Create'" 
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
  props: {
    parameters: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      submitButton: 'Create',
      schema: null,
      item: null
    }
  },
  methods: {
    onSubmitted (values) {
      // Update the item 
      if (this.mode === 'Editing') {
        // Edtng mode => patch the item
        // Do we need to patch a perspective of the item ?
        if (this.parameters.perspective) {
          this.item[this.parameters.perspective] = values
        } else {
          // Patch the entire item
          this.item = values
        }
        this.service.patch(this.id, this.item)
      }
      else {
        // Creation mode => create the item
        this.service.create(values)
      }
    }
  },
  watch: {
    item: function (values) {
      if (this.parameters.perspective) {
        this.$refs.form.fill(values[this.parameters.perspective])
      } else {
        this.$refs.form.fill(values)
      }
    }
  },
  created () {
    this.mode = 'Creation'
    // Retrieve the schema to build the form
    let loadSchema = this.$store.get('loadSchema')
    loadSchema(this.parameters.schema)
    .then(schema => {
      // Assigns the schema to this editor
      this.schema = schema
      // Retrieve the service
      this.service = this.$api.getService(this.parameters.service, this.$store.get(this.parameters.context))
      // Retrieve the id using the this.$store
      this.id = this.$store.get(this.parameters.id)
      // Do we need to get the item ?
      if (this.id)  {
        // Do we need to apply a selection using a specified perspective ?
        if (this.parameters.perspective) {
          this.service.get(this.id, { query: { $select: [this.parameters.perspective] } } )
          .then(item => {
            this.item = item
            this.mode = 'Editing'
          })
        } else {
          this.service.get(this.id)
          .then(item => {
            this.item = item
            this.mode = 'Editing'
          })
        }
      }
    })
  }
}
</script>
