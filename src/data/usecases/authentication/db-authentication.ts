import { type IAuthentication, type AuthenticationModel, type IHashComparer, type ITokenGenerator, type loadAccountByEmailRepository, type IUpdateAccessTokenRepository } from './db-authentication-protocol'

export class DBauthentication implements IAuthentication {
  constructor (private readonly loadAccountByEmailRepository: loadAccountByEmailRepository,
    private readonly hashComparer: IHashComparer,
    private readonly tokenGenerator: ITokenGenerator,
    private readonly updateAccessTokenRepository: IUpdateAccessTokenRepository) {}

  async auth (authenticator: AuthenticationModel): Promise<string | null> {
    const account = await this.loadAccountByEmailRepository.load(authenticator.email)
    if (account) {
      const IsValid = await this.hashComparer.compare(authenticator.password, account.password)
      if (IsValid) {
        const token = await this.tokenGenerator.generate(account.id)
        await this.updateAccessTokenRepository.update(account.id, token)
        return token
      }
    }
    return null
  }
}
