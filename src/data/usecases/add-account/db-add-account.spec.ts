import { type Encrypter } from '../../protocols/encrypter'
import { DbAccount } from './db-add-account'

interface SutTypes {
  sut: DbAccount
  encryptStub: Encrypter
}

const makeEncryptStub = (): Encrypter => {
  class EncryptStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await new Promise(resolve => { resolve('hashed_password') })
    }
  }

  return new EncryptStub()
}
const makeSut = (): SutTypes => {
  const encryptStub = makeEncryptStub()
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

  test('Should throw if Encrypter throws', async () => {
    const { sut, encryptStub } = makeSut()
    jest.spyOn(encryptStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))
    const AccountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    const promise = sut.add(AccountData)
    await expect(promise).rejects.toThrow()
  })
})
