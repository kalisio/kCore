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
  mixins: [mixins.service],
  props: {
    id: {
      type: String,
      default: ''
    },
    perspective: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      mode: 'Creation',
      schema: null,
    }
  },
  methods: {
    updateObject () {
      if (this.isServiceValid()) {
        // Retrieve the object id to be edited
        // if (this.$store.get(this.object)) {
        //  this.id = this.$store.get(this.object)._id
        //}
        // Do we need to get the item ?
        if (this.id)  {
          // Do we need to apply a selection using a specified perspective ?
          let params = {}
          if (this.perspective) {
            params = { query: { $select: [this.perspective] } }
          }
          this.get(this.id, params)
          .then(values => {
            if (this.perspective !== '') {
              this.$refs.form.fill(values[this.perspective])
            } else {
              this.$refs.form.fill(values)
            }
            this.mode = 'Editing'
          }) 
        } else {
          this.mode = 'Creation'
        }
      }
    },
    onSubmitted (values) {
      if (this.isServiceValid()) {
        // Update the item 
        if (this.mode === 'Editing') {
          // Edtng mode => patch the item
          // Do we need to patch a perspective of the item ?
          let data ={}
          if (this.perspective !== '') {
            data[this.perspective] = values
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
    }
  },
  created () {
    // Retrieve the schema to build the form
    let loadSchema = this.$store.get('loadSchema')
    let schemaName = this.service
    if (this.id) {
      schemaName += '-update' 
    } else {
      schemaName +="-create"
    }
    console.log('loading ' + schemaName)
    loadSchema(schemaName)
    .then(schema => {
      // Assigns the schema to this editor
      this.schema = schema
      this.updateObject()
      // Subscribe to the service changed event
      this.$on('service-changed', _ =>  {
        this.updateObject()
      })
    })
  }
}
</script>
