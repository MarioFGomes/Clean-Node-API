import { type HttpRequest, type HttpResponse, type IController, type IAddAccount, type IValidation } from './singup-protocols'
import { BadRequest, Ok, serverError } from '../../helpers/http-helper'

export class SingUpController implements IController {
  constructor (private readonly AddAccount: IAddAccount,
    private readonly validation: IValidation
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
      return Ok(account)
    } catch (error: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return serverError(error)
    }
  }
}
