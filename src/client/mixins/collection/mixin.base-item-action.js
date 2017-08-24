import logger from 'loglevel'

let baseItemAction = {
  data () {
    return {
      actions: []
    }
  },
  methods: {
    onActionTriggered (handler, item) {
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
