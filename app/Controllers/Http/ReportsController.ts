import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Reporter from "App/Helpers/Reporter";
import Category from "App/Models/Category";
import BudgetView from "App/Models/Views/BudgetView";
import Database from "@ioc:Adonis/Lucid/Database";

export default class ReportsController {

    async budgets({auth, request, response}: HttpContextContract) {
        const user = auth.user!
        const budgets = BudgetView.query().where('user_id', user.id)

        const categoryId = request.input('categoryId')
        if (categoryId !== null) budgets.where('category_id', categoryId)

        const filepath = await Reporter.make(await budgets.select([
            'name',
            Database.raw('category_name as category'),
            'total',
            'price',
            'total_price',
        ]))
        return response.attachment(filepath, 'budgets.xlsx')
    }

    async categories({response}: HttpContextContract) {
        const categories = await Category.all()
        const filepath = await Reporter.make(categories)
        return response.attachment(filepath, "nama.xlsx")
    }
}
