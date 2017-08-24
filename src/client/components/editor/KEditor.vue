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
import mixins from '../../mixins'

export default {
  name: 'k-editor',
  components: {
    KForm,
  },
  props: {
    object: {
      type: String,
      default: ''
    },
    parameters: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      mode: 'Creation',
      schema: null,
    }
  },
  mixins: [mixins.service],
  methods: {
    onSubmitted (values) {
      // Update the item 
      if (this.mode === 'Editing') {
        // Edtng mode => patch the item
        // Do we need to patch a perspective of the item ?
        let data ={}
        if (this.parameters.perspective) {
          data[this.parameters.perspective] = values
        } else {
          // Patch the entire item
          data = values
        }
        this.patch(this.id, data)
      }
      else {
        // Creation mode => create the item
        this.create(values)
      }
    }
  },
  created () {
    // Retrieve the schema to build the form
    let loadSchema = this.$store.get('loadSchema')
    loadSchema(this.parameters.schema)
    .then(schema => {
      // Assigns the schema to this editor
      this.schema = schema
      // Retrieve the object id to be edited
      if (this.$store.get(this.object)) {
        this.id = this.$store.get(this.object)._id
      }
      // Do we need to get the item ?
      if (this.id)  {
        // Do we need to apply a selection using a specified perspective ?
        let params = {}
        if (this.parameters.perspective) {
          params = { query: { $select: [this.parameters.perspective] } }
        }
        this.get(this.id, params)
        .then(values => {
          if (this.parameters.perspective) {
            this.$refs.form.fill(values[this.parameters.perspective])
          } else {
            this.$refs.form.fill(values)
          }
          this.mode = 'Editing'
        }) 
      }
    })
  }
}
</script>
