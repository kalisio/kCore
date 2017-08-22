import logger from 'loglevel'

let baseItemAction = {
  dependencies: ['api'],
  data () {
    return {
      actions: []
    }
  },
  methods: {
    onActionRequested (handler, item) {
      let action = this[handler]
      if (typeof action === 'function') {
        action.call(this, item)
      } else {
        logger.warn('[onActionRequested] invalid handler')
      }
    }
  }
}

export default baseItemAction
