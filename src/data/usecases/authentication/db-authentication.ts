import { type AuthenticationModel, type IAuthentication } from '../../../domain/usecases/authentication'
import { type IHashComparer } from '../../protocols/criptography/hashe-compare'
import { type loadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'

export class DBauthentication implements IAuthentication {
  constructor (private readonly loadAccountByEmailRepository: loadAccountByEmailRepository, private readonly hashComparer: IHashComparer) {}
  async auth (authenticator: AuthenticationModel): Promise<string | null> {
    const account = await this.loadAccountByEmailRepository.load(authenticator.email)
    if (account) await this.hashComparer.compare(authenticator.password, account.password)
    return null
  }
}
