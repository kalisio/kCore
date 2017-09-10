<template>
  <div class="column justify-center" style="padding: 36px">
    <k-form v-if="schema"
      ref="form"
      :schema="schema"
      :submit-button="mode === 'Editing' ? 'Update':'Create'"
      :cancel-button="cancelButton"
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
      mode: 'Edition',
      cancelButton: '',
      schema: null
    }
  },
  methods: {
    resolveSchemaName () {
      let schemaName = this.service
      schemaName += this.id ? '.update' : '.create'
      if (this.perspective) {
        schemaName += ('-' + this.perspective)
      }
      return schemaName
    },
    update () {
      let schemaName = this.resolveSchemaName()
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
          this.cancelButton = 'Cancel'
        }
      }
    },
    onSubmitted (values, done) {
      if (this.isServiceValid()) {
        // Update the item 
        if (this.mode === 'Editing') {
          // Edtng mode => patch the item
          if (this.perspective !== '') {
            let data = {}
            data[this.perspective] = values
            this.servicePatch(this.id, data)
          } else {
            this.servicePatch(this.id, values)
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
      // FIXME: 
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
