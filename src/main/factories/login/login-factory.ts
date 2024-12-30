import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { type IController } from '../../../protocols'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository'
import env from '../../config/env'
import { DBauthentication } from '../../../data/usecases/authentication/db-authentication'
import { JwtAdapter } from '../../../infra/criptography/jwt-adapter/jwt-adapter'
import { LoginController } from '../../../presentation/controller/login/login-controller'
import { makeLoginValidation } from './login-validations-factory'

export const makeLoginController = (): IController => {
  const bcryptAdapter = new BcryptAdapter(12)
  const accountMongoRepository = new AccountMongoRepository()
  const jwtAdapter = new JwtAdapter(env.JwtSecret)
  const _DbAuthentication = new DBauthentication(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository)
  const loginController = new LoginController(makeLoginValidation(), _DbAuthentication)
  const logRepository = new LogMongoRepository()
  return new LogControllerDecorator(loginController, logRepository)
}
