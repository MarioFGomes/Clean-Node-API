export default {
  mongoUrl: process.env.MONGO_URL ?? 'mongodb://mongo:27017/clean-node-api',
  port: process.env.PORT ?? 3333,
  JwtSecret: process.env.JWTSCRET ?? '=JGUTY%'
}
