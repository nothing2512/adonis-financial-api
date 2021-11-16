import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Reporter from "App/Helpers/Reporter";
import Category from "App/Models/Category";

export default class ReportsController {

    async categories({response}: HttpContextContract) {
        const categories = await Category.all()
        const filepath = await Reporter.make(categories)
        return response.attachment(filepath, "nama.xlsx")
    }
}
