import { type HttpRequest, type HttpResponse, type IController, type IAuthentication, type IValidation } from './login-protocols'
import { BadRequest, Ok, serverError, unauthorized } from '../../helpers/http//http-helper'

export class LoginController implements IController {
  constructor (private readonly Validation: IValidation,
    private readonly authentication: IAuthentication
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.Validation.validate(httpRequest.body)
      if (error) return BadRequest(error)

      const { email, password } = httpRequest.body

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
