import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Reporter from "App/Helpers/Reporter";
import BudgetView from "App/Models/Views/BudgetView";
import Database from "@ioc:Adonis/Lucid/Database";
import DebtView from "App/Models/Views/DebtView";
import TransactionView from "App/Models/Views/TransactionView";
import {string} from "@ioc:Adonis/Core/Helpers";

export default class ReportsController {

    async budgets({auth, request, response}: HttpContextContract) {
        const user = auth.user!
        const budgets = BudgetView.query().where('user_id', user.id)

        const categoryId = request.input('categoryId')
        if (categoryId !== undefined) budgets.where('category_id', categoryId)

        const filepath = await Reporter.make(await budgets.select([
            'name',
            Database.raw('category_name as category'),
            'total',
            'price',
            'total_price',
        ]))
        return response.attachment(filepath, 'budgets.xlsx')
    }

    async debts({auth, request, response}: HttpContextContract) {
        const user = auth.user!
        const debts = DebtView.query()
            .where('user_id', user.id)
            .select([
                Database.raw("IF(type = 1, 'Hutang', 'Piutang') as type"),
                'description',
                'price',
                'datetime',
                Database.raw('IF(status = 0, "Belum Selesai", "Selesai") as status'),
                'name',
                'phone',
                'email',
                'address',
            ])

        const type = request.input('type')
        if (type !== undefined) debts.where('type', type)

        const debtUserId = request.input('debtUserId')
        if (debtUserId !== undefined) debts.where('debt_user_id', debtUserId)

        const status = request.input('status')
        if (status !== undefined) debts.where('status', status)

        const month = request.input('month')
        const year = request.input('year')
        if (month !== undefined) debts.whereRaw(`MONTH(datetime) = ${month}`)
            .whereRaw(`YEAR(datetime) = ${year}`)

        const filepath = await Reporter.make(
            await debts.orderBy('status')
                .orderBy('id')
        )

        return response.attachment(filepath, 'debts.xlsx')
    }

    async transactions({auth, request, response}: HttpContextContract) {
        const user = auth.user!
        const transactions = TransactionView.query()
            .where('user_id', user.id)
            .orderBy('datetime', 'desc')

        const month = request.input('month')
        const year = request.input('year')
        if (month !== undefined) transactions.whereRaw(`MONTH(datetime) = ${month}`)
            .whereRaw(`YEAR(datetime) = ${year}`)

        const payload = request.only(['categoryId', 'savingId', 'type', 'status'])

        for (let key of Object.keys(payload))
            transactions.where(string.snakeCase(key), payload[key])

        const filepath = await Reporter.make(await transactions.select([
            'datetime',
            Database.raw('IFNULL(category, "-") as category'),
            Database.raw('IFNULL(saving, "-") as saving'),
            Database.raw('IF(type = 1, "Pemasukan", "Pengeluaran") as type'),
            Database.raw('IF(status = 0, "Belum Selesai", "Selesai") as status'),
            'title',
            'description',
            'price'
        ]))
        return response.attachment(filepath, 'transactions.xlsx')
    }
}
