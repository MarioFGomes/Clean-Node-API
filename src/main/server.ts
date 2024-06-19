import { MongoHelper } from '../infra/db/mongodb/helpers/mongo-helper'
import env from './config/env'
import app from './config/app'

MongoHelper.connect(env.mongoUrl)
  .then(() => {
    app.listen(env.port, () => {
      console.log(`server listening on port ${env.port}`)
    })
  }).catch(console.error)
