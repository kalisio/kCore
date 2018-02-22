import _ from 'lodash'
import { BadRequest } from 'feathers-errors'
import { getItems } from 'feathers-hooks-common'
import { populateObject } from './hooks.query'
import makeDebug from 'debug'

const debug = makeDebug('kalisio:kCore:tags:hooks')

function isTagEqual (tag1, tag2) {
  return tag1.value === tag2.value && tag1.scope === tag2.scope
}

export function populateTagResource (hook) {
  if (hook.type !== 'before') {
    throw new Error(`The 'populateResource' hook should only be used as a 'before' hook.`)
  }

  // Avoid populating any target resource when resource parameters are not present
  return populateObject({ serviceField: 'resourcesService', idField: 'resource', throwOnNotFound: false })(hook)
}

export async function updateTags (hook) {
  let item = getItems(hook)
  if (!item.tags) {
    return Promise.resolve(hook)
  }
  // Tag service is contextual, look for context on initiator service
  const context = hook.service.context
  const tagService = hook.app.getService('tags', context)
  if (!tagService) return Promise.reject(new Error('No valid context found to retrieve tag service for initiator service ' + hook.service.name))
  // Retrieve previous version of the item
  let previousTags = _.get(hook.params, 'previousItem.tags')
  if (previousTags) {
    // Find common tags
    const commonTags = _.intersectionWith(item.tags, previousTags, isTagEqual)
    // Clear removed tags
    const removedTags = _.pullAllWith(previousTags, commonTags, isTagEqual)
    debug('Removing tags for object ' + item, removedTags)
    const removePromises = removedTags.map(tag => tagService.remove(null, { query: tag }))
    // And add new ones
    const addedTags = _.pullAllWith(item.tags, commonTags, isTagEqual)
    debug('Adding tags for object ' + item, addedTags)
    const addedPromises = addedTags.map(tag => tagService.create(tag))
    let [ oldTags, newTags ] = await Promise.all([
      Promise.all(removePromises),
      Promise.all(addedPromises)
    ])
    debug('Tags removed/added', oldTags, newTags)
    // Update tags to include information added when they are created (eg _id)
    // and add also context because tags might come from different ones on the same target object
    if (context) {
      newTags = newTags.map(tag => Object.assign({ context: (typeof context === 'object' ? context._id : context) }, tag))
    }
    item.tags = commonTags.concat(newTags)
  } else {
    if (hook.method !== 'remove') {
      // Add new tags
      debug('Adding tags for object ' + item)
      const addPromises = item.tags.map(tag => tagService.create(tag))
      // Update tags to include information added when they are created (eg _id)
      let newTags = await Promise.all(addPromises)
      // and add also context because tags might come from different ones on the same target object
      if (context) {
        newTags = newTags.map(tag => Object.assign({ context: (typeof context === 'object' ? context._id : context) }, tag))
      }
      item.tags = newTags
    } else {
      debug('Removing tags for object ' + item)
      const removePromises = item.tags.map(tag => tagService.remove(null, { query: tag }))
      await Promise.all(removePromises)
    }
  }
  // Avoid transferring some internal data
  // item.tags = item.tags.map(tag => _.omit(tag, ['count']))

  return hook
}

export function addTagIfNew (hook) {
  if (hook.type !== 'before') {
    throw new Error(`The 'addTagIfNew' hook should only be used as a 'before' hook.`)
  }
  const tagService = hook.service
  const value = _.get(hook, 'data.value')
  const scope = _.get(hook, 'data.scope')
  if (!value || !scope) {
    throw new BadRequest('Scope and value should be provided to create a tag')
  }

  return tagService.find({ query: { value, scope } })
  .then(result => {
    // If it already exist avoid creating it in DB,
    // simply update counter and return it
    if (result.total > 0) {
      let tag = result.data[0]
      hook.result = tag
      tag.count += 1
      debug('Increasing tag ' + tag.value + ' count (' + tag.count + ') with scope ' + tag.scope)
      return tagService.patch(tag._id.toString(), { count: tag.count })
    } else {
      // Otherwise initialize tag counter
      hook.data.count = 1
      return Promise.resolve(hook)
    }
  })
  .then(() => {
    return hook
  })
}

export function removeTagIfUnused (hook) {
  if (hook.type !== 'before') {
    throw new Error(`The 'removeTagIfUnused' hook should only be used as a 'before' hook.`)
  }

  const tagService = hook.service
  const value = _.get(hook.params, 'query.value')
  const scope = _.get(hook.params, 'query.scope')
  if (!value || !scope) {
    throw new BadRequest('Scope and value should be provided to remove a tag')
  }

  return tagService.find({ value, scope })
  .then(result => {
    // If it already exist decrease counter and erase it if not used anymore
    if (result.total > 0) {
      let tag = result.data[0]
      hook.result = tag
      tag.count -= 1
      if (tag.count <= 0) {
        debug('Removing unused tag ' + tag.value + ' with scope ' + tag.scope)
        return tagService.remove(tag._id.toString())
      } else {
        debug('Decreasing tag ' + tag.value + ' count (' + tag.count + ') with scope ' + tag.scope)
        return tagService.patch(tag._id.toString(), { count: tag.count })
      }
    } else {
      // Should not be possible, this will skip DB call
      hook.result = null
      return Promise.resolve(hook)
    }
  })
  .then(() => {
    return hook
  })
}

export function tagResource (hook) {
  if (hook.type !== 'after') {
    throw new Error(`The 'tagResource' hook should only be used as a 'after' hook.`)
  }
  const tag = hook.result
  const context = hook.service.context
  const resourcesService = hook.params.resourcesService
  let resource = hook.params.resource
  // If not already tagged
  if (!_.find(resource.tags, resourceTag => isTagEqual(resourceTag, tag))) {
    // Initialize on first tag
    if (!resource.tags) {
      resource.tags = []
    }
    // Add context because tags might come from different ones on the same target object
    if (context) {
      tag.context = (typeof context === 'object' ? context._id : context)
    }
    resource.tags.push(tag)
    return resourcesService.patch(resource._id.toString(), {
      tags: resource.tags
    }, {
      user: hook.params.user
    })
    .then(subject => {
      debug('Tag ' + tag.value + ' set on resource ' + resource._id.toString() + ' with scope ' + tag.scope)
      return hook
    })
  } else {
    return Promise.resolve(hook)
  }
}

export function untagResource (hook) {
  if (hook.type !== 'after') {
    throw new Error(`The 'untagResource' hook should only be used as a 'after' hook.`)
  }

  const tag = hook.result
  const resourcesService = hook.params.resourcesService
  let resource = hook.params.resource
  // If already tagged
  const tagIndex = _.findIndex(resource.tags, resourceTag => isTagEqual(resourceTag, tag))
  if (tagIndex >= 0) {
    _.pullAt(resource.tags, tagIndex)
    return resourcesService.patch(resource._id.toString(), {
      tags: resource.tags
    }, {
      user: hook.params.user
    })
    .then(subject => {
      debug('Tag ' + tag.value + ' unset on resource ' + resource._id.toString() + ' with scope ' + tag.scope)
      return hook
    })
  } else {
    return Promise.resolve(hook)
  }
}
