import { type AccountModel } from '../models/account'

export interface IAddAccountModel {
  name: string
  email: string
  password: string
}

export interface IAddAccount {
  add (account: IAddAccountModel): Promise<AccountModel | null>
}
