import { type HttpRequest, type HttpResponse } from '../../protocols/http'

export class SingUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    if (!httpRequest.body.name) {
      return {
        statusCode: 400,
        body: new Error('name is missing')
      }
    }

    if (!httpRequest.body.email) {
      return {
        statusCode: 400,
        body: new Error('email is missing')
      }
    }

    return {
      statusCode: 200,
      body: 'success'
    }
  }
}
