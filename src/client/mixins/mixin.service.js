import logger from 'loglevel'

let serviceMixin = {
  props: {
    service: {
      type: Object,
      required: true
    }
  },
  watch: {
    service: function (parameters) {
      this._configureService()
    }
  },
  methods: {
    _configureService () {
      let path = this.service.path
      let context = this.$store.get(this.service.context, null)
      this._service = this.$api.getService(path, context)
      if (!this._service) {
        logger.error('Could not find any service with the specified \'service\' property')
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
    this._configureService()
  }
}

export default serviceMixin
