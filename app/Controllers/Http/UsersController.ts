import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Saving from "App/Models/Saving";
import Database from "@ioc:Adonis/Lucid/Database";
import BudgetView from "App/Models/Views/BudgetView";
import Debt from "App/Models/Debt";
import Uploader from "App/Helpers/Uploader";

export default class UsersController {

    async detail({auth, response}: HttpContextContract) {
        const user = auth.user!

        return response.success({
            id: user.id,
            name: user.name,
            email: user.email,
            photo: user.photo,
            balance: (await Saving.query()
                .where('user_id', user.id)
                .select(Database.raw('IFNULL(SUM(balance), 0) as balance'))
                .first())!.balance,
            budget: (await BudgetView.query()
                .where('user_id', user.id)
                .select(Database.raw('IFNULL(SUM(total_price), 0) as total_price'))
                .first())!.totalPrice,
            debtIn: (await Debt.query()
                .where('user_id', user.id)
                .where('status', 0)
                .where('type', 1)
                .select(Database.raw('IFNULL(SUM(price), 0) as price'))
                .first())!.price,
            debtOut: (await Debt.query()
                .where('user_id', user.id)
                .where('status', 0)
                .where('type', 2)
                .select(Database.raw('IFNULL(SUM(price), 0) as price'))
                .first())!.price,
            created_at: user.createdAt,
            updated_at: user.updatedAt,
        })
    }

    async update({auth, request, response}: HttpContextContract) {
        const payload = request.all()
        const user = auth.user!

        const photo = request.file('photo')
        if (photo !== null) payload.photo = await Uploader.photo(photo!)

        user.merge(payload)
        await user.save()

        return response.success(user)
    }
}
