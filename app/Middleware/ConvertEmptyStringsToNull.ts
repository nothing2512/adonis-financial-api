import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'

export default class ConvertEmptyStringsToNull {
    public async handle({request}: HttpContextContract, next: () => Promise<void>) {

        /**
         * Converting Query String
         */
        if (Object.keys(request.qs).length) {
            for (let key of Object.keys(request.qs())) {
                request.updateQs({
                    [key]: request.qs[key] !== '' && request.qs[key] !== undefined
                        ? request.qs[key]
                        : null
                })
            }
        }

        /**
         * Converting Request Body
         */
        if (Object.keys(request.body).length) {
            for (let key of Object.keys(request.body())) {
                request.updateBody({
                    [key]: request.body[key] !== '' && request.body[key] !== undefined
                        ? request.body[key]
                        : null
                })
            }
        }

        await next()
    }
}
