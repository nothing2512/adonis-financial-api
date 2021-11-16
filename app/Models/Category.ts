import {DateTime} from 'luxon'
import {BaseModel, column} from '@ioc:Adonis/Lucid/Orm'

export default class Category extends BaseModel {
    @column({isPrimary: true})
    public id: number

    @column()
    public userId: number

    @column()
    public name: string

    @column.dateTime({autoCreate: true})
    public createdAt: DateTime

    @column.dateTime({autoCreate: true, autoUpdate: true})
    public updatedAt: DateTime

    static async default(userId: number) {
        await Category.createMany([
            {userId: userId, name: 'Elektronik'},
            {userId: userId, name: 'Perlengkapan Rumah'},
            {userId: userId, name: 'Makanan'},
            {userId: userId, name: 'Kebutuhan Akademik'},
            {userId: userId, name: 'Hobi'},
        ])
    }
}
