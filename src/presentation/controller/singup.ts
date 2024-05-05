export class SingUpController {
  handle (httpRequest: any): any {
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
  }
}
