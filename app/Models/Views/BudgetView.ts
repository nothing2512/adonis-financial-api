import {DateTime} from 'luxon'
import {BaseModel, column} from '@ioc:Adonis/Lucid/Orm'

export default class BudgetView extends BaseModel {

    public static table = 'budgets_view'

    @column({isPrimary: true})
    public id: number

    @column()
    public userId: number

    @column()
    public categoryId?: number

    @column()
    public categoryName?: string

    @column()
    public name: string

    @column()
    public total: string

    @column()
    public price: number

    @column()
    public totalPrice: number

    @column.dateTime({autoCreate: true})
    public createdAt: DateTime

    @column.dateTime({autoCreate: true, autoUpdate: true})
    public updatedAt: DateTime
}
