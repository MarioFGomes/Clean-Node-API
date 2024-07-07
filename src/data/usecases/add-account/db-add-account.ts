import { type AccountModel, type IAddAccountModel, type IAddAccount, type Encrypter, type IAddAccountRepository } from './db-add-account-protocol'

export class DbAccount implements IAddAccount {
  constructor (private readonly _encrypt: Encrypter,
    private readonly _AddAccountRepository: IAddAccountRepository
  ) {}

  async add (accountData: IAddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this._encrypt.encrypt(accountData.password)
    const account = await this._AddAccountRepository.add(Object.assign({}, accountData, { password: hashedPassword }))
    return account
  }
}
