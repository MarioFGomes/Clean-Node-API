import { type HttpRequest, type HttpResponse, type IController, type IEmailValidator, type IAddAccount, type IValidation } from './singup-protocols'
import { InvalidParamError, MissingParamError } from '../../errors'
import { BadRequest, Ok, serverError } from '../../helpers/http-helper'

export class SingUpController implements IController {
  constructor (private readonly emailValidator: IEmailValidator,
    private readonly AddAccount: IAddAccount,
    private readonly validation: IValidation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      this.validation.validate(httpRequest.body)

      const requiredFields = ['name', 'email', 'password', 'confirmPassword']

      for (const fields of requiredFields) {
        if (!httpRequest.body[fields]) {
          return BadRequest(new MissingParamError(fields))
        }
      }
      const { name, email, password, confirmPassword } = httpRequest.body

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const IsValidEmail = this.emailValidator.isValid(email)

      if (!IsValidEmail) return BadRequest(new InvalidParamError('email'))

      if (password !== confirmPassword) return BadRequest(new InvalidParamError('confirmPassword'))

      const account = await this.AddAccount.add({
        name,
        email,
        password
      })
      return Ok(account)
    } catch (error: any) {
      console.log(error)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return serverError(error)
    }
  }
}
