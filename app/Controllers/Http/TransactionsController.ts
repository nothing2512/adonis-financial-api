import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import Transaction from "App/Models/Transaction";
import Category from "App/Models/Category";
import Saving from "App/Models/Saving";
import Uploader from "App/Helpers/Uploader";
import Database from "@ioc:Adonis/Lucid/Database";
import TransactionView from "App/Models/Views/TransactionView";
import {string} from '@ioc:Adonis/Core/Helpers'

const IN = 1
const OUT = 2

export default class TransactionsController {
    validatePayload: (payload) => Promise<string>;

    async index({auth, request, response}: HttpContextContract) {
        const user = auth.user!
        const transactions = TransactionView.query()
            .where('user_id', user.id)

        const payload = request.only(['categoryId', 'savingId', 'type', 'status'])

        for (let key of Object.keys(payload))
            transactions.where(string.snakeCase(key), payload[key])

        const month = request.input('month')
        const year = request.input('year')
        if (month !== undefined) transactions.whereRaw(`MONTH(datetime) = ${month}`)
            .whereRaw(`YEAR(datetime) = ${year}`)

        return response.pager(await transactions.paginate(request.input('page', 1)))
    }

    async show({auth, params, response}: HttpContextContract) {
        const user = auth.user!
        const transaction = await Transaction.query()
            .where('user_id', user.id)
            .where('id', params.id)
            .preload('saving')
            .preload('category')
            .first()

        if (transaction === null) return response.error('Transaksi tidak ditemukan')

        return response.success(transaction)
    }

    async store({auth, request, response}: HttpContextContract) {
        await Database.beginGlobalTransaction()
        const user = auth.user!
        const payload = request.all()

        payload.userId = user.id

        const isValidated = await this.validatePayload(payload)
        if (isValidated !== '') return response.error(isValidated)

        const attachment = request.file('attachment')
        if (attachment !== null) payload.attachment = await Uploader.transaction(attachment)

        await Transaction.create(payload)
        await Database.commitGlobalTransaction()

        return response.success(null, 'Berhasil tambah data')
    }

    async update({auth, params, request, response}: HttpContextContract) {
        await Database.beginGlobalTransaction()
        const user = auth.user!
        const payload = Object.assign({userId: user.id}, request.all())
        const transaction = await Transaction.query()
            .where('user_id', user.id)
            .where('id', params.id)
            .preload('saving')
            .first()

        if (transaction === null) return response.error('Transaksi tidak ditemukan')

        if (transaction.savingId != 0) {
            const saving = transaction.saving
            if (transaction.type == IN) saving.balance -= transaction.price
            if (transaction.type == OUT) saving.balance += transaction.price
            await saving.save()
        }

        const isValidated = await this.validatePayload(payload)
        if (isValidated !== '') return response.error(isValidated)

        const attachment = request.file('attachment')
        if (attachment !== null) payload.attachment = await Uploader.transaction(attachment)

        transaction.merge(payload)
        await transaction.save()

        await Database.commitGlobalTransaction()
        return response.success(null, 'Berhasil ubah data')
    }

    async destroy({auth, params, response}: HttpContextContract) {
        const user = auth.user!
        const transaction = await Transaction.query()
            .where('user_id', user.id)
            .where('id', params.id)
            .first()

        if (transaction === null) return response.error('Transaksi tidak ditemukan')

        await transaction.delete()

        return response.success(null, 'Berhasil hapus data')
    }
}

TransactionsController.prototype.validatePayload = async (payload) => {
    if (payload.categoryId !== null) {
        const category = await Category.query()
            .where('id', payload.categoryId)
            .where('user_id', payload.userId)
            .first()

        if (category === null) return 'Kategori tidak ditemukan'
    }

    if (payload.savingId !== null) {
        const saving = await Saving.query()
            .where('id', payload.savingId)
            .where('user_id', payload.userId)
            .first()
        if (saving === null) return 'Penyimpanan tidak ditemukan'

        console.log(typeof saving.balance)
        console.log(typeof payload.price)
        if (payload.type == IN) saving.balance += parseInt(payload.price)
        if (payload.type == OUT) {
            if (payload.price > saving.balance) return 'Saldo pada penyimpanan tidak mencukupi'
            saving.balance -= parseInt(payload.price)
        }

        await saving.save()
    }

    return ''
}
