import path from 'path'
import logger from 'winston'
import fs from 'fs-extra'
import request from 'superagent'
import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import core, { kalisio, hooks, permissions } from '../src'

describe('kCore', () => {
  let app, server, port, baseUrl, accessToken,
    userService, userObject, authorisationService, tagService, tagObject

  before(() => {
    chailint(chai, util)

    // Register default rules for all users
    permissions.defineAbilities.registerHook(permissions.defineUserAbilities)

    app = kalisio()
    // Register perspective hook
    app.hooks({ after: { all: hooks.processPerspectives } })
    port = app.get('port')
    baseUrl = `http://localhost:${port}${app.get('apiPath')}`
    return app.db.connect()
  })

  it('is CommonJS compatible', () => {
    expect(typeof core).to.equal('function')
  })

  it('registers the services', (done) => {
    app.configure(core)
    userService = app.getService('users')
    expect(userService).toExist()
    // Register tag hooks
    userService.hooks({ after: { create: hooks.updateTags, remove: hooks.updateTags } })
    tagService = app.getService('tags')
    expect(tagService).toExist()
    authorisationService = app.getService('authorisations')
    expect(authorisationService).toExist()
    // Now app is configured launch the server
    server = app.listen(port)
    server.once('listening', _ => done())
  })

  it('creates a user', () => {
    return userService.create({
      email: 'test@test.org',
      password: 'test-password',
      name: 'test-user',
      tags: [{
        scope: 'skills',
        value: 'developer'
      }],
      profile: { phone: '0623256968' } }, { checkAuthorisation: true })
    .then(user => {
      userObject = user
      return userService.find({ query: { 'profile.name': 'test-user' } })
    })
    .then(users => {
      expect(users.data.length > 0).beTrue()
      // By default no perspective
      expect(users.data[0].name).toExist()
      expect(users.data[0].description).toExist()
      expect(users.data[0].email).toExist()
      expect(users.data[0].profile).beUndefined()
      return tagService.find({ query: { value: 'developer' } })
    })
    .then(tags => {
      expect(tags.data.length > 0).beTrue()
      expect(tags.data[0].value).to.equal('developer')
      expect(tags.data[0].scope).to.equal('skills')
    })
  })

  it('authenticates a user', () => {
    return request
    .post(`${baseUrl}/authentication`)
    .send({ email: 'test@test.org', password: 'test-password', strategy: 'local' })
    .then(response => {
      accessToken = response.body.accessToken
      expect(accessToken).toExist()
    })
  })

  it('get a user perspective', () => {
    return userService.find({ query: { $select: ['profile'] } })
    .then(users => {
      expect(users.data[0].profile.name).toExist()
      expect(users.data[0].profile.description).toExist()
      expect(users.data[0].profile.phone).toExist()
    })
  })

  it('creates a user tag', () => {
    return tagService.create({
      scope: 'skills',
      value: 'manager'
    }, {
      query: {
        resource: userObject._id.toString(),
        resourcesService: 'users'
      }
    })
    .then(tag => {
      tagObject = tag
      expect(tag).toExist()
      expect(tag.count).to.equal(1)
      return tagService.find({ query: { value: 'manager' } })
    })
    .then(tags => {
      expect(tags.data.length > 0).beTrue()
      expect(tags.data[0].scope).to.equal('skills')
      return userService.find({ query: { 'profile.name': 'test-user' } })
    })
    .then(users => {
      expect(users.data.length > 0).beTrue()
      expect(users.data[0].tags).toExist()
      expect(users.data[0].tags.length === 2).beTrue()
    })
  })

  it('creates an authorization', () => {
    return authorisationService.create({
      scope: 'authorizations',
      permissions: 'update',
      subjects: userObject._id.toString(),
      subjectsService: 'users',
      resource: tagObject._id.toString(),
      resourcesService: 'tags'
    }, {
      user: userObject
    })
    .then(authorisation => {
      expect(authorisation).toExist()
      return userService.get(userObject._id.toString())
    })
    .then(user => {
      expect(user.authorizations).toExist()
      expect(user.authorizations.length > 0).beTrue()
      expect(user.authorizations[0].permissions).to.deep.equal('update')
    })
  })

  it('removes an authorization', () => {
    return authorisationService.remove(tagObject._id, {
      query: {
        scope: 'authorizations',
        subjects: userObject._id.toString(),
        subjectsService: 'users',
        resourcesService: 'tags'
      }
    }, {
      user: userObject
    })
    .then(authorisation => {
      expect(authorisation).toExist()
      return userService.get(userObject._id.toString())
    })
    .then(user => {
      expect(user.authorizations).toExist()
      expect(user.authorizations.length === 0).beTrue()
    })
  })

  it('removes a user tag', () => {
    return tagService.remove(userObject._id, {
      query: {
        scope: 'skills',
        value: 'manager',
        resourcesService: 'users'
      }
    })
    .then(tag => {
      expect(tag).toExist()
      return tagService.find({ query: { value: 'manager' } })
    })
    .then(tags => {
      expect(tags.data.length === 1).beTrue()
      return userService.find({ query: { 'profile.name': 'test-user' } })
    })
    .then(users => {
      expect(users.data.length > 0).beTrue()
      expect(users.data[0].tags.length === 1).beTrue()
    })
  })

  it('unauthenticates a user', () => {
    return request
    .del(`${baseUrl}/authentication`)
    .set('Content-Type', 'application/json')
    .set('Authorization', accessToken)
    .then(response => {
      expect(response.status).to.equal(200)
    })
  })

  it('removes a user', () => {
    return userService.remove(userObject._id, {
      user: userObject,
      checkAuthorisation: true
    })
    .then(user => {
      return userService.find({ query: { name: 'test-user' } })
    })
    .then(users => {
      expect(users.data.length === 0).beTrue()
      return tagService.find({ query: { value: 'developer' } })
    })
    .then(tags => {
      expect(tags.data.length === 0).beTrue()
    })
  })

  it('registers the log options', (done) => {
    let log = 'This is a log test'
    let now = new Date()
    logger.info(log)
    // FIXME: need to let some time to proceed with log file
    // Didn't find a better way since fs.watch() does not seem to work...
    setTimeout(() => {
      let logFilePath = path.join(__dirname, 'test-log-' + now.toISOString().slice(0, 10) + '.log')
      fs.readFile(logFilePath, 'utf8', (err, content) => {
        expect(err).beNull()
        expect(content.includes(log)).to.equal(true)
        done()
      })
    }, 2500)
  })
  // Let enough time to process
  .timeout(5000)

  // Cleanup
  after(async () => {
    if (server) await server.close()
    app.db.instance.dropDatabase()
  })
})
