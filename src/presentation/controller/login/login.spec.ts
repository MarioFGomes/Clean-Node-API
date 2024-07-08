import { LoginController } from './login'
import { BadRequest } from '../../helpers/http-helper'
import { MissingParamError } from '../../errors/MissingParam'

describe('Login Controller', () => {
  test('should return 400 if email is not provided', async () => {
    const sut = new LoginController()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(BadRequest(new MissingParamError('email')))
  })
})
