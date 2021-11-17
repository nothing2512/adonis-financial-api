import {DateTime} from 'luxon'
import {BaseModel, column} from '@ioc:Adonis/Lucid/Orm'

export default class DebtView extends BaseModel {

    public static table = 'debt_view'

    @column({isPrimary: true})
    public id: number

    @column()
    public userId: number

    @column()
    public type: number

    @column()
    public description: string

    @column()
    public price: number

    @column()
    public datetime: number

    @column()
    public status: string

    @column()
    public debtUserId: string

    @column()
    public name: string

    @column()
    public phone: string

    @column()
    public email: string

    @column()
    public address: string

    @column()
    public photo: string

    @column.dateTime({autoCreate: true})
    public createdAt: DateTime

    @column.dateTime({autoCreate: true, autoUpdate: true})
    public updatedAt: DateTime
}
