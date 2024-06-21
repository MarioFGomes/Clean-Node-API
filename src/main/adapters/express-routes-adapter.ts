import { type Request, type Response } from 'express'
import { type HttpRequest, type IController } from '../../protocols'
export const adapterRoute = (controller: IController) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body
    }
    const httpResponse = await controller.handle(httpRequest)
    return res.status(httpResponse.statusCode).json(httpResponse.body)
  }
}
