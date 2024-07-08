import { type HttpRequest, type HttpResponse, type IController } from '../../../protocols'
import { MissingParamError } from '../../errors'
import { BadRequest } from '../../helpers/http-helper'

export class LoginController implements IController {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    return await new Promise(resolve => { resolve(BadRequest(new MissingParamError('email'))) })
  }
}
