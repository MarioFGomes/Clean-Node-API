import { type ILogErrorRepository } from '../../../../data/protocols/db/log/log-error-repository'
import { MongoHelper } from '../helpers/mongo-helper'

export class LogMongoRepository implements ILogErrorRepository {
  async logError (stack: string): Promise<void> {
    const errorCollection = await MongoHelper.getCollation('errors')
    await errorCollection.insertOne({
      stack,
      date: new Date()
    })
  }
}
