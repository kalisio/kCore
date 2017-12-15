import { Events } from 'quasar'
import { createQuerablePromise } from '../utils'

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
    getObjectId () {
      return this._object ? this._object._id : ''
    },
    hasPerspective (perspective) {
      return this._object ? this._object.hasOwnProperty(perspective) : false
    },
    loadObject () {
      // Create a new mixin promise if required
      const objectChanged = (this.getObjectId() !== this.id) || !this.hasPerspective(this.perspective)
      if (!this.objectPromise || objectChanged) {
        this.objectPromise = createQuerablePromise((resolve, reject) => {
          if (!this.id) {
            this._object = null
            resolve(null)
            return
          }
          let params = {}
          if (this.perspective) {
            params = { query: { $select: [this.perspective] } }
          }
          this.loadService()
          .get(this.id, params)
          .then(object => {
            this._object = object
            resolve(object)
          })
          .catch(error => {
            Events.$emit('error', error)
            reject(error)
          })
        })
      }
      return this.objectPromise
    }
  }
}

export default objectProxyMixin
