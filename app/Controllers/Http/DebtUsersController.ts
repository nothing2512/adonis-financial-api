import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import DebtUser from "App/Models/DebtUser";
import Uploader from "App/Helpers/Uploader";

export default class DebtUsersController {

    async index({auth, request, response}: HttpContextContract) {
        const user = auth.user!
        const debtUser = DebtUser.query()
            .where('user_id', user.id)
            .orderBy('name')

        const keyword = request.input('search')
        if (keyword !== undefined) debtUser.where('name', 'LIKE', `%${keyword}%`)

        return response.pager(await debtUser.paginate(request.input('page', 1)))
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
