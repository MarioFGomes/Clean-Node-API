import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return await new Promise(resolve => { resolve('any_token') })
  }
}))

const makeSut = (): JwtAdapter => {
  return new JwtAdapter('secret')
}
describe('jwt adapter', () => {
  test('should call jwt with correct values', () => {
    const sut = makeSut()
    const signSpy = jest.spyOn(jwt, 'sign')
    sut.encrypt('any_Id')
    expect(signSpy).toHaveBeenCalledWith({ Id: 'any_Id' }, 'secret')
  })

  test('should return token on sign success', async () => {
    const sut = makeSut()
    const token = await sut.encrypt('any_Id')
    expect(token).toBe('any_token')
  })

  test('should throw if sign throw', async () => {
    const sut = makeSut()
    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.encrypt('any_Id')
    await expect(promise).rejects.toThrow()
  })
})
