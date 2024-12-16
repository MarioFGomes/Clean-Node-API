import { type IEncrypter } from '../../../data/protocols/criptography/encrypter'
import jwt from 'jsonwebtoken'

export class JwtAdapter implements IEncrypter {
  private readonly _secret: string
  constructor (secret: string) {
    this._secret = secret
  }

  async encrypt (value: string): Promise<string> {
    const token = jwt.sign({ Id: value }, this._secret)
    return token
  }
}
