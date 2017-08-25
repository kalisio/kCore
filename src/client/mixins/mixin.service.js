import logger from 'loglevel'
import { Events } from 'quasar'

let serviceMixin = {
  props: {
    service: {
      type: Object,
      required: true
    }
  },
  watch: {
    service: function () {
      this.configureService()
    }
  },
  methods: {
    isServiceValid () {
      return this._service !== null
    },
    configureService () {
      if (this.service.context) {

        let eventName = this.service.context + '-changed'

        this.$q.events.$on(eventName, this.onServiceContextChanged)
        this.onServiceContextChanged()
      } else {
        this._service = this.$api.getService(this.service.path)
        this.$emit('service-changed')
      }
    },
    onServiceContextChanged () {
      let context = this.$store.get(this.service.context)
      if (context) {
        this._service = this.$api.getService(this.service.path, context)
        this.$emit('service-changed')
      } else {
        this._service = null
      }
    },
    find (params) {
      return this._service.find(params) 
    },
    get (id, params) {
      return this._service.get(id, params)
    },
    create (data, params) { 
      return this._service.create(data, params) 
    },
    update (id, data, params) { 
      return this._service.update(id, data, params) 
    },
    patch (id, data, params) { 
      return this._service.patch(id, data, params) 
    },
    remove (id, params) { 
      return this._service.remove(id, params) 
    }
  },
  created () {
    this.configureService()
  }
}

export default serviceMixin
