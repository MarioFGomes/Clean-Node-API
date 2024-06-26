import request from 'supertest'
import app from '../config/app'

describe('Body Parser middleware', () => {
  test('should parser body as json', async () => {
    app.post('/test_body_parser', (req, res) => {
      res.send(req.body)
    })
    await request(app).post('/test_body_parser').send({ name: 'test_body_parser' })
      .expect({ name: 'test_body_parser' })
  })
})
