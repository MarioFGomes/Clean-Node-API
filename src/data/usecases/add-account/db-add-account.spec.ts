import { type Encrypter, type IAddAccountModel, type AccountModel, type IAddAccountRepository } from './db-add-account-protocol'
import { DbAccount } from './db-add-account'

interface SutTypes {
  sut: DbAccount
  encryptStub: Encrypter
  AddAccountRepositoryStub: IAddAccountRepository
}

const makeEncryptStub = (): Encrypter => {
  class EncryptStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await new Promise(resolve => { resolve('hashed_password') })
    }
  }

  return new EncryptStub()
}

const makeFakeAccount = (): AccountModel => ({
  id: 'Valid_Id',
  name: 'valid_name',
  email: 'valid_email',
  password: 'hashed_password'
})

const makeFakeAccountModel = (): IAddAccountModel => ({
  name: 'valid_name',
  email: 'valid_email',
  password: 'valid_password'
})

const makeAddAccountRepository = (): IAddAccountRepository => {
  class AddAccountRepositoryStub implements IAddAccountRepository {
    async add (accountData: IAddAccountModel): Promise<AccountModel> {
      return await new Promise(resolve => { resolve(makeFakeAccount()) })
    }
  }
  return new AddAccountRepositoryStub()
}
const makeSut = (): SutTypes => {
  const AddAccountRepositoryStub = makeAddAccountRepository()
  const encryptStub = makeEncryptStub()
  const sut = new DbAccount(encryptStub, AddAccountRepositoryStub)
  return {
    sut,
    encryptStub,
    AddAccountRepositoryStub
  }
}
describe('DbAccount UseCases', () => {
  test('Should call Encrypter with correct password', async () => {
    const { sut, encryptStub } = makeSut()
    const EncryptSpy = jest.spyOn(encryptStub, 'encrypt')
    await sut.add(makeFakeAccountModel())
    expect(EncryptSpy).toHaveBeenCalledWith('valid_password')
  })

  test('Should throw if Encrypter throws', async () => {
    const { sut, encryptStub } = makeSut()
    jest.spyOn(encryptStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))
    const promise = sut.add(makeFakeAccountModel())
    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, AddAccountRepositoryStub } = makeSut()
    const addAccountRepositorySpy = jest.spyOn(AddAccountRepositoryStub, 'add')
    await sut.add(makeFakeAccountModel())
    expect(addAccountRepositorySpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password'
    })
  })

  test('Should throw if AddAccountRepository throws', async () => {
    const { sut, AddAccountRepositoryStub } = makeSut()
    jest.spyOn(AddAccountRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))
    const promise = sut.add(makeFakeAccountModel())
    await expect(promise).rejects.toThrow()
  })

  test('Should be return Account on successes', async () => {
    const { sut } = makeSut()
    const account = await sut.add(makeFakeAccountModel())
    expect(account).toEqual({
      id: 'Valid_Id',
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password'
    })
  })
})
