import { type AccountModel } from '../../../domain/models/account'

export interface loadAccountByEmailRepository {
  loadByEmail (email: string): Promise<AccountModel | null>
}
