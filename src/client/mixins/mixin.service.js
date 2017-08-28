import { Events } from 'quasar'

let serviceMixin = {
  props: {
    context: {
      type: String,
      default: ''
    },
    service: {
      type: String,
      required: true
    }
  },
  watch: {
    '$route' (to, from) {
      // react to route changes with the same component
      this.configureService()
    }
  },
  methods: {
    isServiceValid () {
      return this._service !== null
    },
    configureService () {
      if (this.context === '') {
        this._service = this.$api.getService(this.service)
      } else {
        this._service = this.$api.getService(this.service, this.context)
      }
      this.$emit('service-changed')
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
