export interface AuthenticationModel {
  email: string
  password: string
}
export interface IAuthentication {
  auth (authenticator: AuthenticationModel): Promise<string | null>
}
