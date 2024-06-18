import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'

describe('SingUp Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL ?? '')
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('should return an account on success', async () => {
    await request(app).post('/api/signup')
      .send({
        name: 'Mario Gomes',
        email: 'mariogomes@gmail.com',
        password: '123',
        confirmPassword: '123'
      })
      .expect(200)
  })
})
