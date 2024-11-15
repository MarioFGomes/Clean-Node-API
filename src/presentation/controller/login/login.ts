import { type HttpRequest, type HttpResponse, type IController, type IAuthentication, type IEmailValidator } from './login-protocols'
import { InvalidParamError, MissingParamError } from '../../errors'
import { BadRequest, Ok, serverError, unauthorized } from '../../helpers/http-helper'

export class LoginController implements IController {
  constructor (private readonly emailValidator: IEmailValidator,
    private readonly authentication: IAuthentication
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'password']

      for (const fields of requiredFields) {
        if (!httpRequest.body[fields]) {
          return BadRequest(new MissingParamError(fields))
        }
      }
      const { email, password } = httpRequest.body
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const IsValid = this.emailValidator.isValid(email)
      if (!IsValid) {
        return BadRequest(new InvalidParamError('email'))
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const accessToken = await this.authentication.auth(email, password)
      if (!accessToken) return unauthorized()
      return Ok({ accessToken })
    } catch (err: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return serverError(err)
    }
  }
}
