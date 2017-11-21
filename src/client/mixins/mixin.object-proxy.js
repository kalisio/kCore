import lodash from 'lodash'
import logger from 'loglevel'

let objectProxyMixin = {
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
  methods: {
    getObject () {
      return this._object
    },
    loadObject () {
      this._object = null
      if (!lodash.isEmpty(this.id)) {
        if (this.getService()) {
          let params = {}
          if (this.perspective) {
            params = { query: { $select: [this.perspective] } }
          }
          this.getService().get(this.id, params)
          .then(values => {
            this._object = values
            this.$emit('object-changed', this._object)
          })
        } else {
          logger.warn('Invalid service')
        }
      }
      this.$emit('object-changed', this._object)
    }
  },
  created () {
    this.loadObject()
  }
}

export default objectProxyMixin
