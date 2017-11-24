import _ from 'lodash'
import { objectifyIDs } from '../db'
import { discard, disallow, getItems, replaceItems } from 'feathers-hooks-common'
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
    let filterPerspective = true
    if (!_.isNil(query) && !_.isNil(query.$select)) {
      // Transform to array to unify processing
      let selectedFields = (typeof query.$select === 'string' ? [query.$select] : query.$select)
      if (Array.isArray(selectedFields)) {
        selectedFields.forEach(field => {
          // Take care that we might only ask for a subset of perspective fields like ['perspective.fieldName']
          if ( (field === perspective) || field.startsWith(perspective + '.') ) {
            filterPerspective = false
          }
        })
      }
    }
    if (filterPerspective) {
      discard(perspective)(hook)
    }
  })
}

// When perspectives are present we disallow update in order to avoid erase them.
// Indeed when requesting an object they are not retrieved by default
export function preventUpdatePerspectives (hook) {
  let service = hook.service

  // Test if some perspectives are defined on the model
  if (!service.options || !service.options.perspectives) return

  disallow()(hook)
}

// The hook serialize allows to copy/move some properties within the objects holded by the hook
// It applies an array of rules defined by:
// - source: the path to the property to be copied
// - target: the path where to copy the property
// - delete: a flag to define whether the hook has to delete the source property
export function serialize (rules) {
  return function (hook) {
    // Retrieve the items from the hook
    let items = getItems(hook)
    const isArray = Array.isArray(items)
    items = (isArray ? items : [items])
    // Apply the rules for each item
    items.forEach(item => {
      rules.forEach(rule => {
        const source = _.get(item, rule.source)
        if (!_.isNil(source)) {
          _.set(item, rule.target, source)
          if (rule.delete) {
            _.unset(item, rule.source)
          }
        }
      })
    })
    // Replace the items within the hook
    replaceItems(hook, isArray ? items : items[0])
  }
}

// The hook objectify allows to transform the value bound to an '_id' key into mongo ObjectId
export function processObjectIDs (hook) {
  if (hook.params.query) objectifyIDs(hook.params.query)
}
