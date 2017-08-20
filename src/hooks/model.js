import _ from 'lodash'
import { discard } from 'feathers-hooks-common'
// import makeDebug from 'debug'

// const debug = makeDebug('kalisio:kCore')

export function processPerspectives (hook) {
  let params = hook.params
  let query = params.query
  let service = hook.service

  // Test if some perspectives are defined on the model
  if (!service.perspectives) return

  // Iterate through known perspectives of the model
  service.perspectives.forEach(perspective => {
    // Only discard if not explicitely asked by $select
    if (_.isNil(query) || _.isNil(query.$select) || !query.$select.includes(perspective)) {
      discard(perspective)(hook)
    }
  })
}
