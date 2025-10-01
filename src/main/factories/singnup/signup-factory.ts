import { SingUpController } from '../../../presentation/controller/singup/singup-controller'
import { DbAccount } from '../../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { type IController } from '../../../protocols'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository'
import { makeSignupValidation } from './signup-validations-factory'
import { JwtAdapter } from '../../../infra/criptography/jwt-adapter/jwt-adapter'
import { DBauthentication } from '../../../data/usecases/authentication/db-authentication'
import env from '../../config/env'

export const makeSignupController = (): IController => {
  const bcryptAdapter = new BcryptAdapter(12)
  const accountMongoRepository = new AccountMongoRepository()
  const jwtAdapter = new JwtAdapter(env.JwtSecret)
  const _DbAuthentication = new DBauthentication(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository)
  const _DbAccount = new DbAccount(bcryptAdapter, accountMongoRepository)
  const singUpController = new SingUpController(_DbAccount, makeSignupValidation(), _DbAuthentication)
  const logRepository = new LogMongoRepository()
  return new LogControllerDecorator(singUpController, logRepository)
}
