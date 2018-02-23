import path from 'path'
import fs from 'fs-extra'
import aws from 'aws-sdk'
import store from 's3-blob-store'
import { getBase64DataURI } from 'dauria'
import request from 'superagent'
import BlobService from 'feathers-blob'
import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import { kalisio, createStorageService } from '../src'

describe('kCore:storage', () => {
  let app, server, port, baseUrl, s3, storageService, storageObject
  const content = Buffer.from('some buffered data')
  const contentType = 'text/plain'
  const contentUri = getBase64DataURI(content, contentType)
  const id = 'buffer.txt'
  const file = 'logo.png'

  before(() => {
    chailint(chai, util)
    s3 = new aws.S3({
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
    })
    app = kalisio()
    port = app.get('port')
    baseUrl = `http://localhost:${port}${app.get('apiPath')}`
    return app.db.connect()
  })

  it('registers the storage service', (done) => {
    app.configure(core)
    const blobStore = store({
      client: s3,
      bucket: process.env.S3_BUCKET
    })
    const blobService = BlobService({ Model: blobStore, id: '_id' })
    createStorageService.call(app, blobService)
    storageService = app.getService('storage')
    expect(storageService).toExist()
    // Now app is configured launch the server
    server = app.listen(port)
    server.once('listening', _ => done())
  })

  it('creates an object in storage', () => {
    return storageService.create({ id, uri: contentUri }).then(object => {
      storageObject = object
      expect(storageObject._id).to.equal(`${id}`)
      expect(storageObject.uri).to.equal(contentUri)
      expect(storageObject.size).to.equal(content.length)
    })
  })
  // Let enough time to process
  .timeout(10000)

  it('gets an object from storage', () => {
    return storageService.get(id)
    .then(object => {
      storageObject = object
      expect(storageObject.uri).to.equal(contentUri)
      expect(storageObject.size).to.equal(content.length)
    })
  })
  // Let enough time to process
  .timeout(5000)

  it('removes an object from storage', (done) => {
    storageService.remove(id).then(object => {
      return storageService.get(id)
    })
    .catch(error => {
      expect(error).toExist()
      done()
    })
  })
  // Let enough time to process
  .timeout(5000)

  it('creates an object in storage using multipart form data', () => {
    const filePath = path.join(__dirname, 'data', file)
    return request
    .post(`${baseUrl}/storage`)
    .field('id', file)
    .attach('file', filePath)
    .then(response => {
      storageObject = response.body
      expect(storageObject._id).to.equal(`${file}`)
      expect(storageObject.size).to.equal(fs.statSync(filePath).size)
      return storageService.remove(file)
    })
  })
  // Let enough time to process
  .timeout(10000)

  // Cleanup
  after(async () => {
    if (server) await server.close()
    app.db.instance.dropDatabase()
  })
})
