import { type HttpRequest, type HttpResponse, type Controller, type IEmailValidator } from '../../protocols'
import { InvalidParamError, MissingParamError } from '../errors'
import { BadRequest, serverError } from '../helpers/http-helper'

export class SingUpController implements Controller {
  constructor (private readonly emailValidator: IEmailValidator) {}
  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'confirmPassword']

      for (const fields of requiredFields) {
        if (!httpRequest.body[fields]) {
          return BadRequest(new MissingParamError(fields))
        }
      }
      const IsValidEmail = this.emailValidator.isValid(httpRequest.body.email)

      if (!IsValidEmail) return BadRequest(new InvalidParamError('email'))

      return {
        statusCode: 200,
        body: 'success'
      }
    } catch (error) {
      return serverError()
    }
  }
}
