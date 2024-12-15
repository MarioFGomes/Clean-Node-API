import { type IHasher } from '../../data/protocols/criptography/hash'
import { type IHashComparer } from '../../data/protocols/criptography/hash-compare'
import bcrypt from 'bcrypt'

export class BcryptAdapter implements IHasher, IHashComparer {
  private readonly _salt
  constructor (salt: number) {
    this._salt = salt
  }

  async hash (value: string): Promise<string> {
    return await bcrypt.hash(value, this._salt)
  }

  async compare (value: string, hashedValue: string): Promise<boolean> {
    throw new Error('Method not implemented.')
  }
}
