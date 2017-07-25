import path from 'path'
import logger from 'winston'
import fs from 'fs-extra'
import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import core, { kaelia } from '../src'

describe('kCore', () => {
  let app, userService, userObject

  before(() => {
    chailint(chai, util)

    app = kaelia()
    return app.db.connect()
  })

  it('is CommonJS compatible', () => {
    expect(typeof core).to.equal('function')
  })

  it('registers the user service', () => {
    app.configure(core)
    userService = app.getService('users')
    expect(userService).toExist()
  })

  it('creates a user', () => {
    return userService.create({ email: 'test@test.org', name: 'test-user', profile: { phone: '0623256968' } })
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

  it('get a user perspective', () => {
    return userService.find({ query: { $select: ['profile'] } })
    .then(users => {
      expect(users.data[0].profile.phone).toExist()
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

  it('registers the log options', () => {
    let log = 'This is a log test'
    let now = new Date()
    logger.info(log)
    let logFilePath = path.join(__dirname, 'test-log-' + now.toISOString().slice(0, 10) + '.log')
    // expect(fs.existsSync(logFilePath)).to.equal(true)
    let content = fs.readFileSync(logFilePath)
    expect(content.includes(log)).to.equal(true)
  })

  // Cleanup
  after(() => {
    userService.Model.drop()
    app.db.instance.dropDatabase()
  })
})
