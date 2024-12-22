import { type Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'

let accountCollection: Collection
describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL ?? '')
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollation('accounts')
    await accountCollection.deleteMany({})
  })
  test('should return an account on add success', async () => {
    const sut = new AccountMongoRepository()
    const account = await sut.add({
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password'
    })

    expect(account).toBeTruthy()
    expect(account?.id).toBeTruthy()
    expect(account?.name).toBe('valid_name')
    expect(account?.email).toBe('valid_email@email.com')
    expect(account?.password).toBe('valid_password')
  })

  test('should return an account on loadByEmail success', async () => {
    const sut = new AccountMongoRepository()

    accountCollection.insertOne({
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password'
    })
    const account = await sut.loadByEmail('valid_email@email.com')

    expect(account).toBeTruthy()
    expect(account?.id).toBeTruthy()
    expect(account?.name).toBe('valid_name')
    expect(account?.email).toBe('valid_email@email.com')
    expect(account?.password).toBe('valid_password')
  })

  test('should return null if loadByEmail fail', async () => {
    const sut = new AccountMongoRepository()
    const account = await sut.loadByEmail('valid_email@email.com')
    expect(account).toBeFalsy()
  })

  test('should update access token on  success', async () => {
    const sut = new AccountMongoRepository()

    const result = await accountCollection.insertOne({
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password'
    })
    const insertedId = result.insertedId

    await sut.updateAccessToken(insertedId.toString(), 'any_token')

    const account = await accountCollection.findOne({ _id: insertedId })
    expect(account).toBeTruthy()
    expect(account?.accessToken).toBe('any_token')
  })
})
