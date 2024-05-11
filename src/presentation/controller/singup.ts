import { type Controller } from '../../protocols/controller'
import { type IEmailValidator } from '../../protocols/email-validator'
import { type HttpRequest, type HttpResponse } from '../../protocols/http'
import { InvalidParamError } from '../errors/Invalid-param'
import { MissingParamError } from '../errors/MissingParam'
import { ServerError } from '../errors/server-error'
import { badRequest } from '../helpers/http-helper'

export class SingUpController implements Controller {
  constructor (private readonly emailValidator: IEmailValidator) {}
  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'confirmPassword']

      for (const fields of requiredFields) {
        if (!httpRequest.body[fields]) {
          return badRequest(new MissingParamError(fields))
        }
      }
      const IsValidEmail = this.emailValidator.isValid(httpRequest.body.email)

      if (!IsValidEmail) return badRequest(new InvalidParamError('email'))

      return {
        statusCode: 200,
        body: 'success'
      }
    } catch (error) {
      return {
        statusCode: 500,
        body: new ServerError()
      }
    }
  }
}
