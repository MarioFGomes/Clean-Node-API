import { type AccountModel } from '../../../domain/models/account'
import { type AddAccountModel, type IAddAccount } from '../../../domain/usecases/add-account'
import { type Encrypter } from '../../protocols/encrypter'

export class DbAccount implements IAddAccount {
  constructor (private readonly encrypt: Encrypter) {}

  async add (account: AddAccountModel): Promise<AccountModel> {
    await this.encrypt.encrypt(account.password)
    return {
      id: 'valid_id',
      name: account.name,
      email: account.email,
      password: account.password
    }
  }
}
