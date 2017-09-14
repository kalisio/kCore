<template>
  <div class="row justify-center full-width">
    <k-form class="col-10"
      ref="form"
      :schema="schema"
      :submit-button="mode === 'Editing' ? 'Update':'Create'"
      @submitted="onSubmitted"
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
      schema: ''
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
      if (this.schema !== schemaName) {
        this.schema = schemaName
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
      this.$emit('applied')
      done()
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
