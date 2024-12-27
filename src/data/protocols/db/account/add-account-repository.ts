import { type IAddAccountModel } from '../../../../domain/usecases/add-account'
import { type AccountModel } from '../../../../domain/models/account'

export interface IAddAccountRepository {
  add (account: IAddAccountModel): Promise<AccountModel>
}
