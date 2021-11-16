import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Saving from "App/Models/Saving";

export default class SavingsController {

    async index({auth, request, response}: HttpContextContract) {
        const user = auth.user!
        const savings = await Saving.query()
            .where('user_id', user.id)
            .paginate(request.input('page', 1))
        return response.pager(savings)
    }

    async show({auth, params, response}: HttpContextContract) {
        const user = auth.user!
        const saving = await Saving.query()
            .where('user_id', user.id)
            .where('id', params.id)
            .first()

        if (saving === null) return response.error('Tabungan tidak ditemukan')

        return response.success(saving)
    }

    async store({auth, request, response}: HttpContextContract) {
        const user = auth.user!

        const {name, balance} = request.all()

        if (name == null) return response.error('Nama penyimpanan tidak boleh kosong')
        if (balance == null) return response.error('Saldo tidak boleh kosong')
        if (isNaN(balance)) return response.error('Saldo harus berupa angka')

        await Saving.create({
            userId: user.id,
            name: name,
            balance: balance
        })

        return response.success(null, 'Berhasil tambah data')
    }

    async update({auth, params, request, response}: HttpContextContract) {
        const user = auth.user!
        const saving = await Saving.query()
            .where('user_id', user.id)
            .where('id', params.id)
            .first()

        if (saving === null) return response.error('Penyimpanan tidak ditemukan')

        const name = request.input('name')
        if (name == null) return response.error('Nama penyimpanan tidak boleh kosong')

        saving.merge({name: name})
        await saving.save()

        return response.success(null, 'Berhasil ubah data')
    }

    async destroy({auth, params, response}: HttpContextContract) {
        const user = auth.user!
        const saving = await Saving.query()
            .where('user_id', user.id)
            .where('id', params.id)
            .first()

        if (saving === null) return response.error('Penyimpanan tidak ditemukan')

        await saving.delete()

        return response.success(null, 'Berhasil hapus data')
    }

}
