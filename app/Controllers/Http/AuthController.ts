import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import User from "App/Models/User";
import Hash from "@ioc:Adonis/Core/Hash";
import Uploader from "App/Helpers/Uploader";
import Category from "App/Models/Category";

export default class AuthController {

    async login({auth, request, response}: HttpContextContract) {
        const {email, password} = request.all()

        const user = await User.findBy('email', email)
        if (user == null) return response.status(200).json({
            status: false,
            message: 'Email tidak terdaftar',
            data: null
        })

        const isLogged = await Hash.verify(user.password, password)
        if (!isLogged) return response.status(200).json({
            status: false,
            message: 'Password salah',
            data: null
        })

        const token = await auth.login(user)

        return response.success({
            user: user,
            token: token
        })
    }

    async register({auth, request, response}: HttpContextContract) {
        const payload = request.all()

        let user = await User.findBy('email', payload.email)
        if (user !== null) return response.error('Email telah terdaftar di akun lain')

        const photo = request.file('photo')
        payload.photo = await Uploader.photo(photo!)

        user = await User.create(payload)
        await Category.default(user.id)
        const token = await auth.login(user)

        return response.success({
            user: user,
            token: token
        })
    }

    async logout({auth, response}: HttpContextContract) {
        await auth.logout()
        return response.success(null, 'berhasil logout')
    }
}
