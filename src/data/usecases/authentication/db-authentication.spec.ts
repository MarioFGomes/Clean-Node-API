import { type AccountModel } from '../../../domain/models/account'
import { type loadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository'
import { DBauthentication } from './db-authentication'

describe('Authentication', () => {
  test('should call LoadAccountByEmailRepository with correct email', async () => {
    class LoadAccountByEmailRepositoryStub implements loadAccountByEmailRepository {
      async load (email: string): Promise<AccountModel> {
        const account: AccountModel = {
          id: 'any_id',
          name: 'any_name',
          email: 'any_email@mail.com',
          password: 'any_password'
        }

        return await new Promise(resolve => { resolve(account) })
      }
    }
    const loadAccountByEmailRepositoryStub = new LoadAccountByEmailRepositoryStub()
    const sut = new DBauthentication(loadAccountByEmailRepositoryStub)
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    await sut.auth({
      email: 'any_email@mail.com',
      password: 'any_Password'
    })

    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
})
