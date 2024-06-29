export class ServerError extends Error {
  constructor (stack: string | undefined = '') {
    super('Sorry same thing happened with server')
    this.name = 'ServerError'
    this.stack = stack
  }
}
