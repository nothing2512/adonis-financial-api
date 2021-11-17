import {DateTime} from 'luxon'
import {BaseModel, column} from '@ioc:Adonis/Lucid/Orm'

export default class TransactionView extends BaseModel {

    public static table = 'transaction_view'

    @column({isPrimary: true})
    public id: number

    @column()
    public userId: number

    @column()
    public categoryId: number

    @column()
    public category: string

    @column()
    public savingId: number

    @column()
    public saving: string

    @column()
    public type: number

    @column()
    public status: number

    @column()
    public title: string

    @column()
    public description: string

    @column.dateTime()
    public datetime: DateTime

    @column()
    public price: number

    @column()
    public attachment: string

    @column.dateTime({autoCreate: true})
    public createdAt: DateTime

    @column.dateTime({autoCreate: true, autoUpdate: true})
    public updatedAt: DateTime
}
