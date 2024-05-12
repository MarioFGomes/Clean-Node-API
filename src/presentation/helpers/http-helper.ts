import { type HttpResponse } from '../../protocols/http'
import { ServerError } from '../errors'

export const BadRequest = (error: Error): HttpResponse => {
  return {
    statusCode: 400,
    body: error
  }
}

export const serverError = (): HttpResponse => {
  return {
    statusCode: 500,
    body: new ServerError()
  }
}

export const Ok = (data: any): HttpResponse => {
  return {
    statusCode: 200,
    body: data
  }
}
