import { type HttpRequest, type HttpResponse, type IController, type IAddAccount, type IValidation, type IAuthentication } from './singup-controller-protocols'
import { BadRequest, Forbidden, Ok, serverError } from '../../helpers/http/http-helper'
import { EmailInUseError } from '../../errors'

export class SingUpController implements IController {
  constructor (private readonly AddAccount: IAddAccount,
    private readonly validation: IValidation,
    private readonly authentication: IAuthentication
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return BadRequest(error)
      }
      const { name, email, password } = httpRequest.body

      const account = await this.AddAccount.add({
        name,
        email,
        password
      })

      if (!account) {
        return Forbidden(new EmailInUseError())
      }

      const AccessToken = await this.authentication.auth({ email, password })

      return Ok({
        AccessToken
      })
    } catch (error: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return serverError(error)
    }
  }
}
