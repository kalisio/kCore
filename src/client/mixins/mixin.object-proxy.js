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
    hasObject () {
      return !lodash.isEmpty(this.id) && this.getService()
    },
    getObject () {
      return this._object
    },
    loadObject () {
      this.isLoading = true
      let params = {}
      if (this.perspective) {
        params = { query: { $select: [this.perspective] } }
      }
      this.getService().get(this.id, params)
      .then(values => {
        this.isLoading = false
        this._object = values
        this.$emit('object-changed', this._object)
      })
    },
    setObject (object) {
      this._object = object
      this.$emit('object-changed', this._object)
    }
  },
  updated () {
    if (this.hasObject() && !this.isLoading) {
      this.loadObject()
    }
  }
}

export default objectProxyMixin
