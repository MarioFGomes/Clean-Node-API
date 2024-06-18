import request from 'supertest'
import app from '../config/app'

describe('SingUp Routes', () => {
  test('should return an account on success', async () => {
    await request(app).post('/api/singup')
      .send({
        name: 'Mario Gomes',
        email: 'mariogomes@gmail.com',
        password: '123',
        confirmPassword: '123'
      })
      .expect(200)
  })
})
