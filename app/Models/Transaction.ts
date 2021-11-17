import {DateTime} from 'luxon'
import {BaseModel, column, HasOne, hasOne} from '@ioc:Adonis/Lucid/Orm'
import Category from "App/Models/Category";
import Saving from "App/Models/Saving";

export default class Transaction extends BaseModel {
    @column({isPrimary: true})
    public id: number

    @column()
    public userId: number

    @column()
    public categoryId?: number

    @column()
    public savingId?: number

    @column()
    public type?: number

    @column()
    public status: number

    @column()
    public title: string

    @column()
    public description?: string

    @column.dateTime()
    public datetime: DateTime

    @column()
    public price: number

    @column()
    public attachment?: string

    @hasOne(() => Category, {
        localKey: 'categoryId',
        foreignKey: 'id'
    })
    public category: HasOne<typeof Category>

    @hasOne(() => Saving, {
        localKey: 'savingId',
        foreignKey: 'id'
    })
    public saving: HasOne<typeof Saving>

    @column.dateTime({autoCreate: true})
    public createdAt: DateTime

    @column.dateTime({autoCreate: true, autoUpdate: true})
    public updatedAt: DateTime
}
