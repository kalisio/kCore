import path from 'path'
import logger from 'winston'
import fs from 'fs-extra'
import request from 'superagent'
import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import core, { kaelia } from '../src'

describe('kCore', () => {
  let app, server, port, baseUrl, accessToken, userService, userObject

  before(() => {
    chailint(chai, util)

    app = kaelia()
    port = app.get('port')
    baseUrl = `http://localhost:${port}${app.get('apiPath')}`
    console.log(baseUrl)
    return app.db.connect()
  })

  it('is CommonJS compatible', () => {
    expect(typeof core).to.equal('function')
  })

  it('registers the user service', (done) => {
    app.configure(core)
    userService = app.getService('users')
    expect(userService).toExist()
    // Now app is configured launch the server
    server = app.listen(port)
    server.once('listening', _ => done())
  })

  it('creates a user', () => {
    return userService.create({ email: 'test@test.org', password: 'test-password', name: 'test-user', profile: { phone: '0623256968' } })
    .then(user => {
      userObject = user
      return userService.find({ query: { name: 'test-user' } })
      .then(users => {
        expect(users.data.length > 0).beTrue()
        // By default no perspective
        expect(users.data[0].profile).beUndefined()
      })
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
      expect(users.data[0].profile.phone).toExist()
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
    return userService.remove(userObject._id)
    .then(user => {
      return userService.find({ query: { name: 'test-user' } })
      .then(users => {
        expect(users.data.length === 0).beTrue()
      })
    })
  })

  it('registers the log options', (done) => {
    let log = 'This is a log test'
    let now = new Date()
    logger.info(log)
    let logFilePath = path.join(__dirname, 'test-log-' + now.toISOString().slice(0, 10) + '.log')
    // expect(fs.existsSync(logFilePath)).to.equal(true)
    fs.readFile(logFilePath, 'utf8', (err, content) => {
      expect(err).beNull()
      expect(content.includes(log)).to.equal(true)
      done()
    })
  })

  // Cleanup
  after(() => {
    if (server) server.close()
    userService.Model.drop()
    app.db.instance.dropDatabase()
  })
})
