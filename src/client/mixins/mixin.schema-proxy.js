import { Events } from 'quasar'
import { createQuerablePromise } from '../utils'

let schemaProxyMixin = {
  props: {
    schemaName: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      schema: null
    }
  },
  methods: {
    getSchema () {
      return this.schema
    },
    getSchemaId () {
      return this.schema ? this.schema.$id : ''
    },
    getSchemaName () {
      // When used with a service by default use the same name for schema as for service
      let schemaName = this.schemaName || this.service
      schemaName += this.id ? '.update' : '.create'
      if (this.perspective) {
        schemaName += ('-' + this.perspective)
      }
      return schemaName
    },
    loadSchema () {
      // Create a new mixin promise if required
      // In the JSON schema file we use a $id like 'http:/www.kalisio.xyz/schemas/service.operation-perspective.json#'
      const schemaName = this.getSchemaName()
      const schemaChanged = schemaName && !this.getSchemaId().includes(schemaName + '.json')
      if (!this.schemaPromise || schemaChanged) {
        // We need to load the schema now
        this.schemaPromise = createQuerablePromise(
          this.$load(schemaName, 'schema')
          .then(schema => {
            this.schema = schema
          })
          .catch(error => {
            Events.$emit('error', error)
            throw error
          })
        )
      }
      return this.schemaPromise
    }
  }
}

export default schemaProxyMixin
