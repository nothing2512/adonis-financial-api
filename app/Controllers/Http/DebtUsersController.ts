import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import DebtUser from "App/Models/DebtUser";
import Uploader from "App/Helpers/Uploader";

export default class DebtUsersController {

    async all({auth, response}: HttpContextContract) {
        const user = auth.user!
        const debtUser = await DebtUser.query()
            .where('user_id', user.id)
            .orderBy('name')
        return response.success(debtUser)
    }

    async index({auth, request, response}: HttpContextContract) {
        const user = auth.user!
        const debtUser = await DebtUser.query()
            .where('user_id', user.id)
            .orderBy('name')
            .paginate(request.input('page', 1))
        return response.pager(debtUser)
    }

    async show({auth, params, response}: HttpContextContract) {
        const user = auth.user!
        const debtUser = await DebtUser.query()
            .where('user_id', user.id)
            .where('id', params.id)
            .first()

        if (debtUser === null) return response.error('User tidak ditemukan')

        return response.success(debtUser)
    }

    async store({auth, request, response}: HttpContextContract) {
        const user = auth.user!
        const payload = request.all()

        const photo = request.file('photo')
        if (photo !== null) payload.photo = await Uploader.photo(photo)

        await DebtUser.create(Object.assign({
            userId: user.id
        }, payload))

        return response.success(null, 'Berhasil tambah data')
    }

    async update({auth, params, request, response}: HttpContextContract) {
        const user = auth.user!
        const payload = request.all()
        const debtUser = await DebtUser.query()
            .where('user_id', user.id)
            .where('id', params.id)
            .first()

        if (debtUser === null) return response.error('User tidak ditemukan')

        const photo = request.file('photo')
        if (photo !== null) payload.photo = await Uploader.photo(photo)

        debtUser.merge(payload)
        await debtUser.save()

        return response.success(null, 'Berhasil ubah data')
    }

    async destroy({auth, params, response}: HttpContextContract) {
        const user = auth.user!
        const debtUser = await DebtUser.query()
            .where('user_id', user.id)
            .where('id', params.id)
            .first()

        if (debtUser === null) return response.error('Kategori tidak ditemukan')

        await debtUser.delete()

        return response.success(null, 'Berhasil hapus data')
    }
}
