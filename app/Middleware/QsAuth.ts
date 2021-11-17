import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import {AuthenticationException} from "@adonisjs/auth/build/standalone";

export default class QsAuth {
    public async handle({auth, request}: HttpContextContract, next: () => Promise<void>) {
        const token = request.input('token')
        if (token === undefined) QsAuth.unauthorized()

        request.request.headers.authorization = `Bearer ${token}`

        const isValidated = await auth.check()
        if (!isValidated) QsAuth.unauthorized()

        await next()
    }

    private static unauthorized() {
        throw new AuthenticationException(
            'Unauthorized access',
            'E_UNAUTHORIZED_ACCESS',
            'web',
            '',
        )
    }
}
