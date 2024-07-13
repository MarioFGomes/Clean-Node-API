import { type IAuthentication } from '../../../domain/usecases/authentication'
import { type HttpRequest, type HttpResponse, type IController } from '../../../protocols'
import { InvalidParamError, MissingParamError } from '../../errors'
import { BadRequest, Ok, serverError } from '../../helpers/http-helper'
import { type IEmailValidator } from '../singup/singup-protocols'

export class LoginController implements IController {
  constructor (private readonly emailValidator: IEmailValidator,
    private readonly authentication: IAuthentication
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = httpRequest.body
      if (!email) {
        return await new Promise(resolve => { resolve(BadRequest(new MissingParamError('email'))) })
      }
      if (!password) {
        return await new Promise(resolve => { resolve(BadRequest(new MissingParamError('password'))) })
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const IsValid = this.emailValidator.isValid(email)
      if (!IsValid) {
        return await new Promise(resolve => { resolve(BadRequest(new InvalidParamError('email'))) })
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const token = await this.authentication.auth(email, password)
      return Ok(token)
    } catch (err: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return serverError(err)
    }
  }
}
