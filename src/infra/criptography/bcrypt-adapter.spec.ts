import { BcryptAdapter } from './bcrypt-adapter'
import bcrypt from 'bcrypt'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => { resolve('hash') })
  }
}))

const salt = 12
const makeSut = (): BcryptAdapter => {
  const sut = new BcryptAdapter(salt)
  return sut
}
describe('Bcrypt Adapter', () => {
  test('should call bcrypt adapter with correct values', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.hash('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  test('should return hash on success', async () => {
    const sut = makeSut()
    const hash = await sut.hash('any_value')
    expect(hash).toEqual('hash')
  })

  test('should throws if bcrypt throws', async () => {
    const sut = makeSut()
    jest.spyOn<any, string>(bcrypt, 'hash').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))
    const promise = sut.hash('any_value')
    await expect(promise).rejects.toThrow()
  })
})
