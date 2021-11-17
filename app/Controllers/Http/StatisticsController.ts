import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Transaction from "App/Models/Transaction";
import User from "App/Models/User";
import Debt from "App/Models/Debt";
import {ModelQueryBuilderContract} from "@ioc:Adonis/Lucid/Orm";
import Database from "@ioc:Adonis/Lucid/Database";

const IN = 1
const OUT = 2

export default class StatisticsController {
    getCounter: (model: ModelQueryBuilderContract<any>, user: User, date: Date, oldDate: Date) => Promise<{ in: { price: any; increase: number | string }; out: { price: any; increase: number | string } }>;

    async counter({auth, response}: HttpContextContract) {

        const now = new Date()
        const before = new Date()
        before.setMonth(now.getMonth() - 1)

        const user = auth.user!

        const result = {
            transaction: await this.getCounter(Transaction.query(), user, now, before),
            debt: await this.getCounter(Debt.query(), user, now, before),
        }

        return response.success(result)
    }
}

StatisticsController.prototype.getCounter = async  (model: ModelQueryBuilderContract<any, any>, user: User, date: Date, oldDate: Date) => {

    let getData = async (d: Date) => {
        const month = d.getMonth() + 1
        const year = d.getFullYear()

        const debtIn = await model
            .whereRaw(`MONTH(datetime) = ${month}`)
            .whereRaw(`YEAR(datetime) = ${year}`)
            .where('user_id', user.id)
            .where('type', IN)
            .select(Database.raw('IFNULL(SUM(price), 0) as price'))
            .first()

        const debtOut = await model
            .whereRaw(`MONTH(datetime) = ${month}`)
            .whereRaw(`YEAR(datetime) = ${year}`)
            .where('user_id', user.id)
            .where('type', OUT)
            .select(Database.raw('IFNULL(SUM(price), 0) as price'))
            .first()

        return {
            in: debtIn['price'],
            out: debtOut['price']
        }
    }

    const newData = await getData(date)
    const oldData = await getData(oldDate)

    return {
        in: {
            price: newData.in,
            increase: oldData.in == 0 && newData.in == 0
                ? 0
                : (oldData.in == 0
                    ? 100
                    : ((newData.in - oldData.in) / oldData.in * 100).toFixed(2))
        },
        out: {
            price: newData.out,
            increase: oldData.out == 0 && newData.out == 0
                ? 0
                : (oldData.out == 0
                    ? 100
                    : ((newData.out - oldData.out) / oldData.out * 100).toFixed(2))
        }
    }
}
