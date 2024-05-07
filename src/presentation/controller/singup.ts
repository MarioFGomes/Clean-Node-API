import { type Controller } from '../../protocols/controller'
import { type HttpRequest, type HttpResponse } from '../../protocols/http'
import { MissingParamError } from '../errors/MissingParam'
import { badRequest } from '../helpers/http-helper'

export class SingUpController implements Controller {
  handle (httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password', 'confirmPassword']

    for (const fields of requiredFields) {
      if (!httpRequest.body[fields]) {
        return badRequest(new MissingParamError(fields))
      }
    }

    return {
      statusCode: 200,
      body: 'success'
    }
  }
}
