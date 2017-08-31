<template>
  <div class="column justify-center" style="padding: 36px">
    <k-form v-if="schema"
      ref="form"
      :schema="schema"
      :submit-button="mode === 'Editing' ? 'Update':'Create'"
      @submitted="onSubmitted" 
      @canceled="onCanceled" 
      @form-ready="onFormReady" />
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
    update () {
      let schemaName = this.service
      if (this.id) {
        schemaName += '.update' 
      } else {
        schemaName += ".create"
      }
      if (this.schemaName !== schemaName) {
        this.schema = null
        let loadSchema = this.$store.get('loadSchema')
        loadSchema(schemaName)
        .then(schema => {
          // Assigns the schema to this editor
          this.schemaName = schemaName
          this.schema = schema
        })
      } else {
        this.updateObject()
      }
    },
    updateObject () {
      if (this.isServiceValid()) {
        // Do we need to get the item ?
        if (this.id)  {
          // Do we need to apply a selection using a specified perspective ?
          let params = {}
          if (this.perspective) {
            params = { query: { $select: [this.perspective] } }
          }
          this.serviceGet(this.id, params)
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
    onSubmitted (values, done) {
      if (this.isServiceValid()) {
        // Update the item 
        if (this.mode === 'Editing') {
          // Edtng mode => patch the item
          // Do we need to patch a perspective of the item ?
          if (this.perspective !== '') {
            let data = {}
            data[this.perspective] = values
            this.servicePatch(this.id, data)
          } else {
            this.serviceUpdate(this.id, values)
          }
        }
        else {
          // Creation mode => create the item
          this.serviceCreate(values)
        }
      }
      done()
    },
    onCanceled () {
      // TODO
    },
    onFormReady () {
      this.updateObject()
    }
  },
  created () {
    this.schemaName = ''
    this.update()
    this.$on('service-changed', _ =>  this.update())
  }
}
</script>
