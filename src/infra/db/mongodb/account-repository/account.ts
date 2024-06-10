import { type AccountModel, type AddAccountModel, type IAddAccount } from '../../../../data/usecases/add-account/db-add-account-protocol'
import { MongoHelper } from '../helpers/mongo-helper'
export class AccountMongoRepository implements IAddAccount {
  async add (account: AddAccountModel): Promise<AccountModel | null> {
    const accountCollections = MongoHelper.getCollation('accounts')
    const result = await accountCollections.insertOne(account)
    const insertedId = result.insertedId
    const insertedAccount = await accountCollections.findOne({ _id: insertedId })
    if (insertedAccount != null) {
      return MongoHelper.map(insertedAccount)
    }
    return await new Promise(resolve => { resolve(null) })
  }
}
