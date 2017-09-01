import _ from 'lodash'
import { discard } from 'feathers-hooks-common'
// import makeDebug from 'debug'

// const debug = makeDebug('kalisio:kCore')

export function processPerspectives (hook) {
  let params = hook.params
  let query = params.query
  let service = hook.service

  // Test if some perspectives are defined on the model
  if (!service.options || !service.options.perspectives) return

  // Iterate through known perspectives of the model
  service.options.perspectives.forEach(perspective => {
    // Only discard if not explicitely asked by $select
    if (_.isNil(query) || _.isNil(query.$select) || !query.$select.includes(perspective)) {
      discard(perspective)(hook)
    }
  })
}

// The hook serialize allows to copy/move some properties within the objects holded by the hook
// It applies an array of rules defined by:
// - source: the path to the property to be copied
// - target: the path where to copy the property
// - delete: a flag to define whether the hook has to delete the source property
export function serialize (rules) {
  return function (hook) {
    rules.forEach(rule => {
      const source = _.get(hook.data, rule.source)
      if (!_.isNil(source)) {
        _.set(hook.data, rule.target, source)
        if (rule.delete) {
          _.unset(hook.data, rule.source)
        }
      }
    })
  }
}
