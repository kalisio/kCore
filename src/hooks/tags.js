import _ from 'lodash'
import { BadRequest } from 'feathers-errors'
import { populateObject } from './query'
import makeDebug from 'debug'

const debug = makeDebug('kalisio:kCore:tags')

export function populateResource (hook) {
  if (hook.type !== 'before') {
    throw new Error(`The 'populateResource' hook should only be used as a 'before' hook.`)
  }

  return populateObject('resourcesService', 'resource')(hook)
}

export function addTag (hook) {
  if (hook.type !== 'before') {
    throw new Error(`The 'addTag' hook should only be used as a 'before' hook.`)
  }

  const tagService = hook.service
  if (!hook.data || !hook.data.value || !hook.data.scope) {
    throw new BadRequest('Scope and value should be provided to create a tag')
  }
  const value = hook.data.value
  const scope = hook.data.scope
  return tagService.find({ value, scope })
  .then(result => {
    // If it already exist avoid creating it in DB,
    // simply update counter and return it
    if (result.total > 0) {
      const tag = result.data[0]
      hook.result = tag
      return tagService.patch(tag._id, { count: tag.count + 1 })
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

export function removeTag (hook) {
  if (hook.type !== 'before') {
    throw new Error(`The 'removeTag' hook should only be used as a 'before' hook.`)
  }

  const tagService = hook.service
  const resourcesService = hook.params.resourcesService
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
        return tagService.remove(tag._id)
      } else {
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
  if (!_.find(resource.tags, resourceTag => resourceTag.value === tag.value && resourceTag.scope === tag.Scope)) {
    // Initialize on first tag
    if (!resource.tags) {
      resource.tags = []
    }
    resource.tags.push({ value: tag.value, tag: tag.scope })
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
  const tagIndex = _.findIndex(resource.tags, resourceTag => resourceTag.value === tag.value && resourceTag.scope === tag.Scope)
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
