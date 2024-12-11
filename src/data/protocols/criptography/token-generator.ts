export interface ITokenGenerator {
  generate (Id: string): Promise<string>
}
