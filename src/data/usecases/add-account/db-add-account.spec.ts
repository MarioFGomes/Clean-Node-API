import { type Encrypter } from '../../protocols/encrypter'
import { DbAccount } from './db-add-account'

interface SutTypes {
  sut: DbAccount
  encryptStub: Encrypter
}

const makeSut = (): SutTypes => {
  class EncryptStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await new Promise(resolve => { resolve('hashed_password') })
    }
  }

  const encryptStub = new EncryptStub()
  const sut = new DbAccount(encryptStub)

  return {
    sut,
    encryptStub
  }
}
describe('DbAccount UseCases', () => {
  test('Should call Encrypter with correct password', async () => {
    const { sut, encryptStub } = makeSut()
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