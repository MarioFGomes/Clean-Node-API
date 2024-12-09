import { type AccountModel } from '../../../domain/models/account'
import { type AuthenticationModel } from '../../../domain/usecases/authentication'
import { type loadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { DBauthentication } from './db-authentication'

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
})

const makeFakeAuthentication = (): AuthenticationModel => ({
  email: 'any_email@mail.com',
  password: 'any_Password'
})

interface SutTypes {
  sut: DBauthentication
  loadAccountByEmailRepositoryStub: loadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const sut = new DBauthentication(loadAccountByEmailRepositoryStub)
  return {
    sut,
    loadAccountByEmailRepositoryStub
  }
}

const makeLoadAccountByEmailRepository = (): loadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements loadAccountByEmailRepository {
    async load (email: string): Promise<AccountModel> {
      return await new Promise(resolve => { resolve(makeFakeAccount()) })
    }
  }

  return new LoadAccountByEmailRepositoryStub()
}
describe('DBauthentication UseCase', () => {
  test('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    await sut.auth(makeFakeAuthentication())

    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('should throw if  LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))

    const promise = sut.auth(makeFakeAuthentication())

    await expect(promise).rejects.toThrow()
  })
})
