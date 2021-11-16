import {DateTime} from 'luxon'
import {BaseModel, column, HasOne, hasOne} from '@ioc:Adonis/Lucid/Orm'
import DebtUser from "App/Models/DebtUser";

export default class Debt extends BaseModel {
    @column({isPrimary: true})
    public id: number

    @column()
    public userId: number

    @column()
    public debtUserId: number

    @column()
    public type: number

    @column()
    public description: string

    @column()
    public price: number

    @column.dateTime()
    public datetime: DateTime

    @column()
    public status: number

    @hasOne(() => DebtUser, {
        localKey: 'debtUserId',
        foreignKey: 'id'
    })
    public debtUser: HasOne<typeof DebtUser>

    @column.dateTime({autoCreate: true})
    public createdAt: DateTime

    @column.dateTime({autoCreate: true, autoUpdate: true})
    public updatedAt: DateTime
}
