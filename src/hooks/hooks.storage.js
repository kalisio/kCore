import _ from 'lodash'
import { populateObject } from './hooks.query'
import makeDebug from 'debug'

const debug = makeDebug('kalisio:kCore:storage:hooks')

function isAttachmentEqual (file1, file2) {
  return file1._id === file2._id
}

export function populateAttachmentResource (hook) {
  if (hook.type !== 'before') {
    throw new Error(`The 'populateStorageResource' hook should only be used as a 'before' hook.`)
  }

  // Avoid populating any target resource when resource parameters are not present
  return populateObject({ serviceField: 'resourcesService', idField: 'resource', throwOnNotFound: false })(hook)
}

export async function attachToResource (hook) {
  if (hook.type !== 'after') {
    throw new Error(`The 'attachToResource' hook should only be used as a 'after' hook.`)
  }
  const data = hook.data
  const params = hook.params
  const query = params.query
  const file = hook.result
  const attachmentField = _.get(data, 'field') || _.get(query, 'field') || 'attachments'
  const isArray = (_.get(data, 'singleFile') || _.get(query, 'singleFile') ? false : true)
  const context = hook.service.context
  const resourcesService = params.resourcesService
  let resource = params.resource
  let attachments = _.get(resource, attachmentField)
  let attachment = { _id: file._id }
  // Add context because attachments might come from different ones on the same target object
  if (context) {
    attachment.context = (typeof context === 'object' ? context._id : context)
  }
  if (isArray) {
    // Initialize on first attachment
    if (!attachments) attachments = []
    attachments.push(attachment)
  } else {
    attachments = attachment
  }

  await resourcesService.patch(resource._id.toString(), {
    [attachmentField]: attachments
  }, {
    user: hook.params.user
  })
  debug('Attached file ' + file._id + ' on resource ' + resource._id.toString())
  return hook
}

export async function detachFromResource (hook) {
  if (hook.type !== 'after') {
    throw new Error(`The 'detachFromResource' hook should only be used as a 'after' hook.`)
  }

  const params = hook.params
  const query = params.query
  let file = hook.result
  // Feathers blob has an inconsistent behavior accross operations,
  // see https://github.com/feathersjs-ecosystem/feathers-blob/issues/39
  file._id = file.id
  const attachmentField = _.get(query, 'field') || 'attachments'
  const isArray = (_.get(query, 'singleFile') ? false : true)
  const resourcesService = params.resourcesService
  let resource = params.resource
  let attachments = _.get(resource, attachmentField)
  if (isArray) {
    const attachmentIndex = _.findIndex(attachments, attachment => isAttachmentEqual(attachment, file))
    if (attachmentIndex >= 0) {
      _.pullAt(attachments, attachmentIndex)
    }
  } else {
    attachments = null
  }

  await resourcesService.patch(resource._id.toString(), {
    [attachmentField]: attachments
  }, {
    user: hook.params.user
  })
  debug('Detached file ' + file._id + ' on resource ' + resource._id.toString())
  return hook
}
