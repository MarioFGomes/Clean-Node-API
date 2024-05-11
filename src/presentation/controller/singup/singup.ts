import { type HttpRequest, type HttpResponse, type Controller, type IEmailValidator, type IAddAccount } from './singup-protocols'
import { InvalidParamError, MissingParamError } from '../../errors'
import { BadRequest, serverError } from '../../helpers/http-helper'

export class SingUpController implements Controller {
  constructor (private readonly emailValidator: IEmailValidator,
    private readonly AddAccount: IAddAccount
  ) {}

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'confirmPassword']

      for (const fields of requiredFields) {
        if (!httpRequest.body[fields]) {
          return BadRequest(new MissingParamError(fields))
        }
      }
      const { name, email, password, confirmPassword } = httpRequest.body

      const IsValidEmail = this.emailValidator.isValid(email)

      if (!IsValidEmail) return BadRequest(new InvalidParamError('email'))

      if (password !== confirmPassword) return BadRequest(new InvalidParamError('confirmPassword'))

      const account = this.AddAccount.add({
        name,
        email,
        password
      })

      return {
        statusCode: 200,
        body: account
      }
    } catch (error) {
      return serverError()
    }
  }
}
