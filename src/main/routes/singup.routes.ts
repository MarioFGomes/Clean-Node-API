import { type Router } from 'express'
import { makeSignupController } from '../factories/signup'
import { adapterRoute } from '../adapters/express-routes-adapter'

export default (router: Router): void => {
  router.post('/signup', adapterRoute(makeSignupController()))
}
