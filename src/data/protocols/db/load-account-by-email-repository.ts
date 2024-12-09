import { type AccountModel } from '../../../domain/models/account'

export interface loadAccountByEmailRepository {
  load (email: string): Promise<AccountModel>
}
