import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Budget from "App/Models/Budget";
import Category from "App/Models/Category";
import BudgetView from "App/Models/Views/BudgetView";

export default class BudgetsController {

    async index({auth, request, response}: HttpContextContract) {
        const user = auth.user!
        const budgets = await BudgetView.query()
            .where('user_id', user.id)
            .paginate(request.input('page', 1))
        return response.pager(budgets)
    }

    async indexByCategory({auth, params, request, response}: HttpContextContract) {
        const user = auth.user!

        const category = await Category.query()
            .where('user_id', user.id)
            .where('id', params.id)
            .first()

        if (category === null) return response.error('Kategori tidak ditemukan')

        const budgets = await BudgetView.query()
            .where('user_id', user.id)
            .where('category_id', params.id)
            .paginate(request.input('page', 1))

        return response.pager(budgets)
    }

    async show({auth, params, response}: HttpContextContract) {
        const user = auth.user!
        const budget = await BudgetView.query()
            .where('user_id', user.id)
            .where('id', params.id)
            .first()

        if (budget === null) return response.error('Anggaran tidak ditemukan')

        return response.success(budget)
    }

    async store({auth, request, response}: HttpContextContract) {
        const user = auth.user!

        const {name, total, price, categoryId} = request.all()

        if (categoryId !== null) {
            const category = await Category.query()
                .where('user_id', user.id)
                .where('id', categoryId)
                .first()
            if (category === null) return response.error('Kategori tidak ditemukan')
        }

        await Budget.create({
            userId: user.id,
            name: name,
            total: total,
            price: price,
            categoryId: categoryId
        })

        return response.success(null, 'Berhasil tambah data')
    }

    async update({auth, params, request, response}: HttpContextContract) {
        const user = auth.user!
        const payload = request.all()
        const budget = await Budget.query()
            .where('user_id', user.id)
            .where('id', params.id)
            .first()

        if (budget === null) return response.error('Penyimpanan tidak ditemukan')

        if (payload.categoryId !== null) {
            const category = await Category.query()
                .where('user_id', user.id)
                .where('id', payload.categoryId)
                .first()
            if (category === null) return response.error('Kategori tidak ditemukan')
        }

        budget.merge(payload)
        await budget.save()

        return response.success(null, 'Berhasil ubah data')
    }

    async destroy({auth, params, response}: HttpContextContract) {
        const user = auth.user!
        const budget = await Budget.query()
            .where('user_id', user.id)
            .where('id', params.id)
            .first()

        if (budget === null) return response.error('Anggaran tidak ditemukan')

        await budget.delete()

        return response.success(null, 'Berhasil hapus data')
    }
}
