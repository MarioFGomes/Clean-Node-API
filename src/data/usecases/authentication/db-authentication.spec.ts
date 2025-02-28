import { DBauthentication } from './db-authentication'
import { type AccountModel, type AuthenticationModel, type IHashComparer, type IEncrypter, type IloadAccountByEmailRepository, type IUpdateAccessTokenRepository } from './db-authentication-protocol'

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'hashed_password'
})

const makeFakeAuthentication = (): AuthenticationModel => ({
  email: 'any_email@mail.com',
  password: 'any_Password'
})

interface SutTypes {
  sut: DBauthentication
  loadAccountByEmailRepositoryStub: IloadAccountByEmailRepository
  hashComparerStub: IHashComparer
  encrypterStub: IEncrypter
  UpdateAccessTokenRepositoryStub: IUpdateAccessTokenRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const hashComparerStub = makeHashComparer()
  const encrypterStub = makeEncrypterStub()
  const UpdateAccessTokenRepositoryStub = makeUpdateTokenRepository()
  const sut = new DBauthentication(loadAccountByEmailRepositoryStub, hashComparerStub, encrypterStub, UpdateAccessTokenRepositoryStub)
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    UpdateAccessTokenRepositoryStub
  }
}

const makeLoadAccountByEmailRepository = (): IloadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements IloadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel | null> {
      return await new Promise(resolve => { resolve(makeFakeAccount()) })
    }
  }

  return new LoadAccountByEmailRepositoryStub()
}

const makeHashComparer = (): IHashComparer => {
  class HashComparerStub implements IHashComparer {
    async compare (value: string, hashedValue: string): Promise<boolean> {
      return await new Promise(resolve => { resolve(true) })
    }
  }

  return new HashComparerStub()
}

const makeEncrypterStub = (): IEncrypter => {
  class EncrypterStub implements IEncrypter {
    async encrypt (value: string): Promise<string> {
      return await new Promise(resolve => { resolve('any_token') })
    }
  }

  return new EncrypterStub()
}

const makeUpdateTokenRepository = (): IUpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements IUpdateAccessTokenRepository {
    async updateAccessToken (Id: string, token: string): Promise<void> {
      await new Promise<void>(resolve => { resolve() })
    }
  }

  return new UpdateAccessTokenRepositoryStub()
}

describe('DBauthentication UseCase', () => {
  test('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await sut.auth(makeFakeAuthentication())

    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('should throw if  LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))

    const promise = sut.auth(makeFakeAuthentication())

    await expect(promise).rejects.toThrow()
  })

  test('should return null if LoadAccountByEmailRepository return null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(new Promise(resolve => { resolve(null) }))
    const accessToken = await sut.auth(makeFakeAuthentication())

    expect(accessToken).toBeNull()
  })

  test('should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut()
    const compareSpy = jest.spyOn(hashComparerStub, 'compare')
    await sut.auth(makeFakeAuthentication())

    expect(compareSpy).toHaveBeenCalledWith('any_Password', 'hashed_password')
  })

  test('should throw if  HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })

  test('should return null if HashComparer return null', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise(resolve => { resolve(false) }))
    const accessToken = await sut.auth(makeFakeAuthentication())

    expect(accessToken).toBeNull()
  })

  test('should call Encrypter with correct Id', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    await sut.auth(makeFakeAuthentication())

    expect(encryptSpy).toHaveBeenCalledWith('any_id')
  })

  test('should throw if  Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })

  test('should return a token if Encrypter called  with correct Id', async () => {
    const { sut } = makeSut()
    const AccessToken = await sut.auth(makeFakeAuthentication())
    expect(AccessToken).toBe('any_token')
  })

  test('should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, UpdateAccessTokenRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(UpdateAccessTokenRepositoryStub, 'updateAccessToken')
    await sut.auth(makeFakeAuthentication())

    expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token')
  })

  test('should throw if  UpdateAccessTokenRepository throws', async () => {
    const { sut, UpdateAccessTokenRepositoryStub } = makeSut()
    jest.spyOn(UpdateAccessTokenRepositoryStub, 'updateAccessToken').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })
})
