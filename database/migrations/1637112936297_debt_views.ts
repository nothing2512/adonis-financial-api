import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import Database from "@ioc:Adonis/Lucid/Database";

export default class DebtViews extends BaseSchema {
    protected tableName = 'debt_view'

    public async up() {
        await Database.rawQuery(`
            CREATE VIEW ${this.tableName} AS
            SELECT
                debt.id,
                debt.user_id,
                debt.type,
                debt.description,
                debt.price,
                debt.datetime,
                debt.status,
                debt.debt_user_id,
                user.name,
                user.phone,
                user.email,
                user.address,
                user.photo
            FROM debts debt
            LEFT JOIN debt_users user
                ON user.id = debt.debt_user_id
                AND user.user_id = debt.user_id
        `)
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
