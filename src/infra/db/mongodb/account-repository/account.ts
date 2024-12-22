import { ObjectId } from 'mongodb'
import { type IloadAccountByEmailRepository } from '../../../../data/protocols/db/load-account-by-email-repository'
import { type IUpdateAccessTokenRepository } from '../../../../data/protocols/db/update-access-token-repository'
import { type IAddAccountRepository, type IAddAccountModel, type AccountModel } from '../../../../data/usecases/add-account/db-add-account-protocol'
import { MongoHelper } from '../helpers/mongo-helper'
export class AccountMongoRepository implements IAddAccountRepository, IloadAccountByEmailRepository, IUpdateAccessTokenRepository {
  async updateAccessToken (Id: string, token: string): Promise<void> {
    const accountCollections = await MongoHelper.getCollation('accounts')
    const id = new ObjectId(Id)
    await accountCollections.updateOne(
      {
        _id: id

      },
      {
        $set: {
          accessToken: token
        }
      })
  }

  async loadByEmail (email: string): Promise<AccountModel | null> {
    const accountCollections = await MongoHelper.getCollation('accounts')
    const account = await accountCollections.findOne({ email })
    return account && MongoHelper.map(account)
  }

  async add (account: IAddAccountModel) {
    const accountCollections = await MongoHelper.getCollation('accounts')
    const result = await accountCollections.insertOne(account)
    const insertedId = result.insertedId
    const insertedAccount = await accountCollections.findOne({ _id: insertedId })
    return MongoHelper.map(insertedAccount)
  }
}
