import logger from 'loglevel'

let serviceMixin = {
  props: {
    service: {
      type: Object,
      required: true
    }
  },
  methods: {
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
    if (!this.service.path) {
      logger.error('The \'service\' property should contains a \'path\' property')
      return
    }
    let path = this.service.path
    let context = this.$store.get(this.service.context, null)
    this._service = this.$api.getService(path, context)
    if (!this._service) {
      logger.error('The specified service doest not exist')
    }
  }
}

export default serviceMixin
