import { type Encrypter } from '../../data/protocols/encrypter'
import bcrypt from 'bcrypt'

export class BcryptAdapter implements Encrypter {
  private readonly _salt
  constructor (salt: number) {
    this._salt = salt
  }

  async encrypt (value: string): Promise<string> {
    return await bcrypt.hash(value, this._salt)
  }
}
