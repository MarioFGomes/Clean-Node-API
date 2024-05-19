import { type Encrypter } from '../../protocols/encrypter'
import { DbAccount } from './db-add-account'

describe('DbAccount UseCases', () => {
  test('Should call Encrypter with correct password', async () => {
    class EncryptStub implements Encrypter {
      async encrypt (value: string): Promise<string> {
        return await new Promise(resolve => { resolve('hashed_password') })
      }
    }
    const encryptStub = new EncryptStub()
    const sut = new DbAccount(encryptStub)
    const EncryptSpy = jest.spyOn(encryptStub, 'encrypt')
    const AccountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    await sut.add(AccountData)
    expect(EncryptSpy).toHaveBeenCalledWith('valid_password')
  })
})
