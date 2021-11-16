import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Debt from "App/Models/Debt";
import DebtUser from "App/Models/DebtUser";

export default class DebtsController {

    async all({auth, response}: HttpContextContract) {
        const user = auth.user!
        const debts = await Debt.query()
            .where('user_id', user.id)
            .preload('debtUser')
        return response.success(debts)
    }

    async index({auth, request, response}: HttpContextContract) {
        const user = auth.user!
        const debts = await Debt.query()
            .where('user_id', user.id)
            .preload('debtUser')
            .paginate(request.input('page', 1))
        return response.pager(debts)
    }

    async show({auth, params, response}: HttpContextContract) {
        const user = auth.user!
        const debt = await Debt.query()
            .where('user_id', user.id)
            .where('id', params.id)
            .preload('debtUser')
            .first()

        if (debt === null) return response.error('Hutang tidak ditemukan')

        return response.success(debt)
    }

    async store({auth, request, response}: HttpContextContract) {
        const user = auth.user!
        const payload = request.all()

        payload.status = 0
        payload.userId = user.id

        const debtUser = await DebtUser.query()
            .where('id', payload.debtUserId)
            .where('user_id', user.id)
            .first()

        if (debtUser === null) return response.error('User tidak ditemukan')

        await Debt.create(payload)

        return response.success(null, 'Berhasil tambah data')
    }

    async update({auth, params, request, response}: HttpContextContract) {
        const user = auth.user!
        const payload = request.all()
        const debt = await Debt.query()
            .where('user_id', user.id)
            .where('id', params.id)
            .first()

        if (debt === null) return response.error('Hutang tidak ditemukan')

        const debtUser = await DebtUser.query()
            .where('id', payload.debtUserId)
            .where('user_id', user.id)
            .first()

        if (debtUser === null) return response.error('User tidak ditemukan')

        debt.merge(payload)
        await debt.save()

        return response.success(null, 'Berhasil ubah data')
    }

    async destroy({auth, params, response}: HttpContextContract) {
        const user = auth.user!
        const debt = await Debt.query()
            .where('user_id', user.id)
            .where('id', params.id)
            .first()

        if (debt === null) return response.error('Hutang tidak ditemukan')

        await debt.delete()

        return response.success(null, 'Berhasil hapus data')
    }

    async done({auth, params, response}: HttpContextContract) {
        const user = auth.user!
        const debt = await Debt.query()
            .where('user_id', user.id)
            .where('id', params.id)
            .first()

        if (debt === null) return response.error('Hutang tidak ditemukan')

        debt.merge({status: 1})
        await debt.save()

        return response.success(debt)
    }

    async undo({auth, params, response}: HttpContextContract) {
        const user = auth.user!
        const debt = await Debt.query()
            .where('user_id', user.id)
            .where('id', params.id)
            .first()

        if (debt === null) return response.error('Hutang tidak ditemukan')

        debt.merge({status: 0})
        await debt.save()

        return response.success(debt)
    }
}
