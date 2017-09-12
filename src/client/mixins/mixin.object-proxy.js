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
  watch: {
    id: function () {
      this.loadObject()
    }
  },
  methods: {
    getObject () {
      return this._object
    },
    loadObject () {
      this._object = null
      if (this.getService()) {
        let params = {}
        if (this.perspective) {
          params = { query: { $select: [this.perspective] } }
        }
        this.getService().get(this.id, params)
        .then(values => {
          this._object = values
          this.$emit('object-changed')
        })
      } else {
        logger.warn('Invalid service')
      }
      this.$emit('object-changed')
    }
  },
  created () {
    this.loadObject()
  }
}

export default objectProxyMixin
