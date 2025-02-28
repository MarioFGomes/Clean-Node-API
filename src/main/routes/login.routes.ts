import { type Router } from 'express'
import { makeSignupController } from '../factories/singnup/signup-factory'
import { adapterRoute } from '../adapters/express/express-routes-adapter'
import { makeLoginController } from '../factories/login/login-factory'

export default (router: Router): void => {
  router.post('/signup', adapterRoute(makeSignupController()))
  router.post('/login', adapterRoute(makeLoginController()))
}
