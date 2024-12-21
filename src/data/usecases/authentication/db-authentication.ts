import { type IAuthentication, type AuthenticationModel, type IHashComparer, type IEncrypter, type IloadAccountByEmailRepository, type IUpdateAccessTokenRepository } from './db-authentication-protocol'

export class DBauthentication implements IAuthentication {
  constructor (private readonly loadAccountByEmailRepository: IloadAccountByEmailRepository,
    private readonly hashComparer: IHashComparer,
    private readonly encrypter: IEncrypter,
    private readonly updateAccessTokenRepository: IUpdateAccessTokenRepository) {}

  async auth (authenticator: AuthenticationModel): Promise<string | null> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(authenticator.email)
    if (account) {
      const IsValid = await this.hashComparer.compare(authenticator.password, account.password)
      if (IsValid) {
        const token = await this.encrypter.encrypt(account.id)
        await this.updateAccessTokenRepository.updateAccessToken(account.id, token)
        return token
      }
    }
    return null
  }
}
