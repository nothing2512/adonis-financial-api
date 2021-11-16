/*
|--------------------------------------------------------------------------
| Http Exception Handler
|--------------------------------------------------------------------------
|
| AdonisJs will forward all exceptions occurred during an HTTP request to
| the following class. You can learn more about exception handling by
| reading docs.
|
| The exception handler extends a base `HttpExceptionHandler` which is not
| mandatory, however it can do lot of heavy lifting to handle the errors
| properly.
|
*/

import Logger from '@ioc:Adonis/Core/Logger'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'
import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";

export default class ExceptionHandler extends HttpExceptionHandler {
    protected statusPages = {
        '403': 'errors/unauthorized',
        '404': 'errors/not-found',
        '500..599': 'errors/server-error',
    }

    constructor() {
        super(Logger)
    }

    handle(error: any, ctx: HttpContextContract): Promise<any> {
        switch (error.code) {
            case 'E_ROUTE_NOT_FOUND':
                return Promise.resolve(ctx.response.error('Rute tidak ditemukan'))
            case 'E_UNAUTHORIZED_ACCESS':
                return Promise.resolve(ctx.response.error('Akses ditolak'))
            default:
                return super.handle(error, ctx);
        }
    }
}
