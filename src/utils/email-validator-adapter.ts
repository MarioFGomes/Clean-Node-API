import { type IEmailValidator } from '../protocols/email-validator'

export class EmailValidatorAdapter implements IEmailValidator {
  isValid (email: string): boolean {
    return false
  }
}
