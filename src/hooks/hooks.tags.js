import _ from 'lodash'
import { BadRequest } from 'feathers-errors'
import { populateObject } from './hooks.query'
import makeDebug from 'debug'

const debug = makeDebug('kalisio:kCore:hooks:tags')

export function populateTagResource (hook) {
  if (hook.type !== 'before') {
    throw new Error(`The 'populateResource' hook should only be used as a 'before' hook.`)
  }

  // Avoid populating any target resource when resource parameters are not present
  return populateObject({ serviceField: 'resourcesService', idField: 'resource', throwOnNotFound: false })(hook)
}

export function updateTags (hook) {
  const tags = (hook.method === 'remove' ? hook.result.tags : hook.data.tags)
  if (!tags) {
    return Promise.resolve(hook)
  }
  // Tag service is contextual, look for context on initiator service
  const tagService = hook.app.getService('tags', hook.service.context)
  if (!tagService) return Promise.reject(new Error('No valid context found to retrieve tag service for initiator service ' + hook.service.name))

  return Promise.all(tags.map(tag => {
    return (hook.method === 'remove' ? tagService.remove(null, { query: tag }) : tagService.create(tag))
  }))
  .then(results => {
    return hook
  })
}

export function addTagIfNew (hook) {
  if (hook.type !== 'before') {
    throw new Error(`The 'addTagIfNew' hook should only be used as a 'before' hook.`)
  }
  const tagService = hook.service
  if (!hook.data || !hook.data.value || !hook.data.scope) {
    throw new BadRequest('Scope and value should be provided to create a tag')
  }
  const value = hook.data.value
  const scope = hook.data.scope
  return tagService.find({ query: { value, scope } })
  .then(result => {
    // If it already exist avoid creating it in DB,
    // simply update counter and return it
    if (result.total > 0) {
      const tag = result.data[0]
      hook.result = tag
      const count = tag.count + 1
      debug('Increasing tag ' + tag.value + ' count (' + count + ') with scope ' + tag.scope)
      return tagService.patch(tag._id, { count })
    } else {
      // Otherwise initialize tag counter
      hook.data.count = 1
      return hook
    }
  })
  .then(_ => {
    return hook
  })
}

export function removeTagIfUnused (hook) {
  if (hook.type !== 'before') {
    throw new Error(`The 'removeTagIfUnused' hook should only be used as a 'before' hook.`)
  }

  const tagService = hook.service
  if (!hook.params || !hook.params.query || !hook.params.query.value || !hook.params.query.scope) {
    throw new BadRequest('Scope and value should be provided to create a tag')
  }
  const value = hook.params.query.value
  const scope = hook.params.query.scope

  return tagService.find({ value, scope })
  .then(result => {
    // If it already exist decrease counter and erase it if not used anymore
    if (result.total > 0) {
      let tag = result.data[0]
      tag.count = tag.count - 1
      hook.result = tag
      if (tag.count <= 0) {
        debug('Removing unused tag ' + tag.value + ' with scope ' + tag.scope)
        return tagService.remove(tag._id)
      } else {
        debug('Decreasing tag ' + tag.value + ' count (' + tag.count + ') with scope ' + tag.scope)
        return tagService.patch(tag._id, { count: tag.count })
      }
    } else {
      // Should not be possible, this will skip DB call
      hook.result = null
      return hook
    }
  })
  .then(_ => {
    return hook
  })
}

export function tagResource (hook) {
  if (hook.type !== 'after') {
    throw new Error(`The 'tagResource' hook should only be used as a 'after' hook.`)
  }
  const tag = hook.result
  const resourcesService = hook.params.resourcesService
  let resource = hook.params.resource
  // If not already tagged
  if (!_.find(resource.tags, resourceTag => resourceTag.value === tag.value && resourceTag.scope === tag.scope)) {
    // Initialize on first tag
    if (!resource.tags) {
      resource.tags = []
    }
    resource.tags.push(_.omit(tag, '_id'))
    return resourcesService.patch(resource._id, {
      tags: resource.tags
    }, {
      user: hook.params.user
    })
    .then(subject => {
      debug('Tag ' + tag.value + ' set on resource ' + resource._id + ' with scope ' + tag.scope)
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
  const tagIndex = _.findIndex(resource.tags, resourceTag => resourceTag.value === tag.value && resourceTag.scope === tag.scope)
  if (tagIndex >= 0) {
    _.pullAt(resource.tags, tagIndex)
    return resourcesService.patch(resource._id, {
      tags: resource.tags
    }, {
      user: hook.params.user
    })
    .then(subject => {
      debug('Tag ' + tag.value + ' unset on resource ' + resource._id + ' with scope ' + tag.scope)
    })
  } else {
    return Promise.resolve(hook)
  }
}
