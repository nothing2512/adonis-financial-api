import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Category from "App/Models/Category";

export default class CategoriesController {

    async all({auth, response}: HttpContextContract) {
        const user = auth.user!
        const categories = await Category.query()
            .where('user_id', user.id)
            .orderBy('name')
        return response.success(categories)
    }

    async index({auth, response}: HttpContextContract) {
        const user = auth.user!
        const categories = await Category.query()
            .where('user_id', user.id)
            .orderBy('name')
        return response.success(categories)
    }

    async show({auth, params, response}: HttpContextContract) {
        const user = auth.user!
        const category = await Category.query()
            .where('user_id', user.id)
            .where('id', params.id)
            .first()

        if (category === null) return response.error('Kategori tidak ditemukan')

        return response.success(category)
    }

    async store({auth, request, response}: HttpContextContract) {
        const user = auth.user!

        const name = request.input('name')
        if (name == null) return response.error('Nama kategori tidak boleh kosong')

        await Category.create({
            userId: user.id,
            name: name
        })

        return response.success(null, 'Berhasil tambah data')
    }

    async update({auth, params, request, response}: HttpContextContract) {
        const user = auth.user!
        const category = await Category.query()
            .where('user_id', user.id)
            .where('id', params.id)
            .first()

        if (category === null) return response.error('Kategori tidak ditemukan')

        const name = request.input('name')
        if (name == null) return response.error('Nama kategori tidak boleh kosong')

        category.merge({name: name})
        await category.save()

        return response.success(null, 'Berhasil ubah data')
    }

    async destroy({auth, params, response}: HttpContextContract) {
        const user = auth.user!
        const category = await Category.query()
            .where('user_id', user.id)
            .where('id', params.id)
            .first()

        if (category === null) return response.error('Kategori tidak ditemukan')

        await category.delete()

        return response.success(null, 'Berhasil hapus data')
    }
}
