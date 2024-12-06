import { type AuthenticationModel, type IAuthentication } from '../../../domain/usecases/authentication'
import { type loadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository'

export class DBauthentication implements IAuthentication {
  constructor (private readonly loadAccountByEmailRepository: loadAccountByEmailRepository) {}
  async auth (authenticator: AuthenticationModel): Promise<string | null> {
    await this.loadAccountByEmailRepository.load(authenticator.email)
    return null
  }
}
