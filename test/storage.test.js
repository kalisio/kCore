import aws from 'aws-sdk'
import store from 's3-blob-store'
import { getBase64DataURI } from 'dauria'
import BlobService from 'feathers-blob'
import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import { kalisio, createStorageService } from '../src'

describe('kCore:storage', () => {
  let app, s3, storageService, storageObject
  const content = Buffer.from('some buffered data')
  const contentType = 'text/plain'
  const contentUri = getBase64DataURI(content, contentType)
  const context = 'test'
  const id = 'buffer.txt'

  before(() => {
    chailint(chai, util)
    s3 = new aws.S3({
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
    })
    app = kalisio()
  })

  it('registers the storage service', () => {
    const blobStore = store({
      client: s3,
      bucket: process.env.S3_BUCKET
    })
    const blobService = BlobService({ Model: blobStore, id: '_id' })
    createStorageService.call(app, 'test', blobService)
    storageService = app.getService('storage', context)
    expect(storageService).toExist()
  })

  it('creates an object in storage', () => {
    return storageService.create({ id, uri: contentUri }).then(object => {
      storageObject = object
      expect(storageObject._id).to.equal(`${context}/${id}`)
      expect(storageObject.uri).to.equal(contentUri)
      expect(storageObject.size).to.equal(content.length)
    })
  })
  // Let enough time to process
  .timeout(5000)

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

  // Cleanup
  after(() => {
  })
})
