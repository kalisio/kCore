import logger from 'loglevel'

let baseEditorMixin = {
  props: {
    clearButton: {
      type: String,
      default: ''
    },
    resetButton: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      schema: '',
      applyButton: ''
    }
  },
  methods: {
    onServiceChanged () {
      let schemaName = this.resolveSchemaName()
      if (this.schema !== schemaName) {
        this.updateForm(schemaName)
      }
    },
    onObjectChanged () {
      let schemaName = this.resolveSchemaName()
      if (this.schema !== schemaName) {
        this.updateForm(schemaName)
      }
      if (this.$refs.form.isReady) {
        this.fillEditor()
      }
    },
    resolveSchemaName () {
      let schemaName = this.service
      schemaName += this.id ? '.update' : '.create'
      if (this.perspective) {
        schemaName += ('-' + this.perspective)
      }
      return schemaName
    },
    updateForm (schemaName) {
      this.schema = schemaName
      this.applyButton = ''
    },
    fillEditor () {
      if (this.$refs.form.isReady) {
        if (this.getObject()) {
          if (this.perspective !== '') {
            this.$refs.form.fill(this.getObject()[this.perspective])
          } else {
            this.$refs.form.fill(this.getObject())
          }
          this.applyButton = 'Update'
        } else {
          this.applyButton = 'Create'
        }
      } else {
        logger.warn('Trying to fill the editor with a non-ready form')
      }
    },
    clear () {
      if (this.$refs.form.isReady) {
        this.$refs.form.clear()
      } else {
        logger.warn('Trying to clear the editor with a non-ready form')
      }
    },
    reset () {
      if (this.$refs.form.isReady) {
        this.$refs.form.reset()
      } else {
        logger.warn('Trying to reset the editor with a non-ready form')
      }
    },
    apply (event, done) {
      if (this.$refs.form.isReady) {
        let form = this.$refs.form.validate()
        if (!form.isValid) {
          if (done) done()
          return
        }
        if (this.isServiceValid()) {
          // Update the item
          if (this.applyButton === 'Update') {
            // Edtng mode => patch the item
            if (this.perspective !== '') {
              let data = {}
              data[this.perspective] = form.values
              this.servicePatch(this.id, data, { query: { $select: [this.perspective] } })
              .then(_ => { if (done) done() })
            } else {
              this.servicePatch(this.id, form.values)
              .then(_ => { if (done) done() })
            }
          } else if (this.applyButton === 'Create') {
            // Creation mode => create the item
            this.serviceCreate(form.values)
            .then(_ => { if (done) done() })
          } else {
            logger.warn('Invalid editor mode')
            if (done) done()
          }
        }
        this.$emit('applied')
      } else {
        logger.warn('Trying to apply the editor with a non-ready form')
        if (done) done()
      }
    }
  },
  created () {
    this.onServiceChanged()
    this.$on('service-changed', _ => this.onServiceChanged())
    this.$on('object-changed', _ => this.onObjectChanged())
  }
}

export default baseEditorMixin
