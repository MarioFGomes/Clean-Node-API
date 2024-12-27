export interface IUpdateAccessTokenRepository {
  updateAccessToken (Id: string, token: string): Promise<void>
}
