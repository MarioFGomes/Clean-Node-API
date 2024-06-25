import { type Collection, MongoClient } from 'mongodb'

export const MongoHelper = {
  client: null as unknown as MongoClient,
  uri: null as unknown as string,

  async connect (url: string): Promise<void> {
    this.uri = url
    this.client = await MongoClient.connect(url)
  },

  async disconnect (): Promise<void> {
    await this.client.close()
  },

  async getCollation (name: string): Promise<Collection> {
    this.connect(this.uri)
    return this.client.db().collection(name)
  },

  map (collection: any): any {
    const { _id, ...accountWithoutId } = collection
    return Object.assign({}, accountWithoutId, { id: _id })
  }
}
