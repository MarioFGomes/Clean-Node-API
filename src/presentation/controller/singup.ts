import { type Controller } from '../../protocols/controller'
import { type IEmailValidator } from '../../protocols/email-validator'
import { type HttpRequest, type HttpResponse } from '../../protocols/http'
import { InvalidParamError } from '../errors/Invalid-param'
import { MissingParamError } from '../errors/MissingParam'
import { badRequest } from '../helpers/http-helper'

export class SingUpController implements Controller {
  constructor (private readonly emailValidator: IEmailValidator) {}
  handle (httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password', 'confirmPassword']

    for (const fields of requiredFields) {
      if (!httpRequest.body[fields]) {
        return badRequest(new MissingParamError(fields))
      }
    }
    const IsvalidEmail = this.emailValidator.isValid(httpRequest.body.email)

    if (!IsvalidEmail) return badRequest(new InvalidParamError('email'))

    return {
      statusCode: 200,
      body: 'success'
    }
  }
}
