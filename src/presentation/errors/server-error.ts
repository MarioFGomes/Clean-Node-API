export class ServerError extends Error {
  constructor () {
    super('Sorry same thing happened with server')
    this.name = 'ServerError'
  }
}
