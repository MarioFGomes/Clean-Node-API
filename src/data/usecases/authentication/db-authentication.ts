import { type AuthenticationModel, type IAuthentication } from '../../../domain/usecases/authentication'
import { type IHashComparer } from '../../protocols/criptography/hashe-compare'
import { type ITokenGenerator } from '../../protocols/criptography/token-generator'
import { type loadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'

export class DBauthentication implements IAuthentication {
  constructor (private readonly loadAccountByEmailRepository: loadAccountByEmailRepository, private readonly hashComparer: IHashComparer, private readonly tokenGenerator: ITokenGenerator) {}
  async auth (authenticator: AuthenticationModel): Promise<string | null> {
    const account = await this.loadAccountByEmailRepository.load(authenticator.email)
    if (account) {
      await this.hashComparer.compare(authenticator.password, account.password)
      await this.tokenGenerator.generate(account.id)
    }
    return null
  }
}
