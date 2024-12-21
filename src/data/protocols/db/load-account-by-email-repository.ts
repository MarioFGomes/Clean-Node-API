import { type AccountModel } from '../../../domain/models/account'

export interface IloadAccountByEmailRepository {
  loadByEmail (email: string): Promise<AccountModel | null>
}
