import { type IAddAccountRepository, type IAddAccountModel } from '../../../../data/usecases/add-account/db-add-account-protocol'
import { MongoHelper } from '../helpers/mongo-helper'
export class AccountMongoRepository implements IAddAccountRepository {
  async add (account: IAddAccountModel) {
    const accountCollections = await MongoHelper.getCollation('accounts')
    const result = await accountCollections.insertOne(account)
    const insertedId = result.insertedId
    const insertedAccount = await accountCollections.findOne({ _id: insertedId })
    return MongoHelper.map(insertedAccount)
  }
}
