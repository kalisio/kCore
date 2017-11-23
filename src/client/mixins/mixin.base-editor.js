import logger from 'loglevel'
import { createQuerablePromise } from '../utils'

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
      schema: null,
      applyButton: ''
    }
  },
  watch: {
    '$route' (to, from) {
      // React to route changes but reusing the same component
      this.refresh()
    }
  },
  methods: {
    loadSchema () {
      let schemaName = this.service
      schemaName += this.id ? '.update' : '.create'
      if (this.perspective) {
        schemaName += ('-' + this.perspective)
      }
      // We need to load the schema now
      let loader = this.$store.get('loadSchema')
      return loader(schemaName)
      .then(schema => this.schema = schema)
    },
    fillEditor () {
      if (this.$refs.form.loadRefs().isFulfilled()) {
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
      if (this.$refs.form.loadRefs().isFulfilled()) {
        this.$refs.form.clear()
      } else {
        logger.warn('Trying to clear the editor with a non-ready form')
      }
    },
    reset () {
      if (this.$refs.form.loadRefs().isFulfilled()) {
        this.$refs.form.reset()
      } else {
        logger.warn('Trying to reset the editor with a non-ready form')
      }
    },
    apply (event, done) {
      if (this.$refs.form.loadRefs().isFulfilled()) {
        let form = this.$refs.form.validate()
        if (!form.isValid) {
          if (done) done()
          return
        }
        if (this.getService()) {
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
    },
    refresh () {
      // When the service is available
      this.loadService()
      // We can then load the schema/object and local refs in parallel
      Promise.all([
        this.loadSchema(),
        this.loadObject(),
        this.loadRefs()
      ])
      // We finally build the form then fill it
      .then(_ => this.$refs.form.build())
      .then(_ => this.fillEditor())
    }
  },
  created () {
    this.refresh()
  }
}

export default baseEditorMixin
