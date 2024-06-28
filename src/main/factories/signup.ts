import { SingUpController } from '../../presentation/controller/singup/singup'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'
import { DbAccount } from '../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { LogControllerDecorator } from '../decorators/log'
import { type IController } from '../../protocols'

export const makeSignupController = (): IController => {
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const bcryptAdapter = new BcryptAdapter(12)
  const accountMongoRepository = new AccountMongoRepository()
  const _DbAccount = new DbAccount(bcryptAdapter, accountMongoRepository)
  const singUpController = new SingUpController(emailValidatorAdapter, _DbAccount)
  return new LogControllerDecorator(singUpController)
}
