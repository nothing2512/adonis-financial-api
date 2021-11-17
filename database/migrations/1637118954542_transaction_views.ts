import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import Database from "@ioc:Adonis/Lucid/Database";

export default class TransactionViews extends BaseSchema {
    protected tableName = 'transaction_view'

    public async up() {
        await Database.rawQuery(`
            CREATE VIEW ${this.tableName} AS
            SELECT
                transactions.id,
                transactions.user_id,
                transactions.category_id,
                categories.name as category,
                transactions.saving_id,
                savings.name as saving,
                transactions.type,
                transactions.status,
                transactions.title,
                transactions.description,
                transactions.datetime,
                transactions.price,
                transactions.attachment
            FROM transactions
            LEFT JOIN categories ON categories.id = transactions.category_id
            LEFT JOIN savings ON savings.id = transactions.saving_id
        `)
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
