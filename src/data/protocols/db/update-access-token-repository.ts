export interface IUpdateAccessTokenRepository {
  update (Id: string, token: string): Promise<void>
}
