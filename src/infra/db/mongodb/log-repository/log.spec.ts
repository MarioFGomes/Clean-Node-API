import { type Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { LogMongoRepository } from './log'

describe('Log Mongo Repository', () => {
  let errorCollection: Collection
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL ?? '')
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollation('errors')
    await errorCollection.deleteMany({})
  })
  test('should create an error log on success', async () => {
    const sut = new LogMongoRepository()
    await sut.logError('any_error_stack')
    const count = await errorCollection.countDocuments()
    console.log(count)
    expect(count).toBe(1)
  })
})
