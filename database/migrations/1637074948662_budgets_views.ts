import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import Database from "@ioc:Adonis/Lucid/Database";

export default class BudgetsViews extends BaseSchema {
    protected tableName = 'budgets_view'

    public async up() {

        await Database.rawQuery(`
            CREATE VIEW ${this.tableName} AS
            SELECT
                budgets.id,
                budgets.user_id,
                budgets.category_id,
                categories.name as category_name,
                budgets.name,
                budgets.total,
                budgets.price,
                (budgets.total * budgets.price) as total_price,
                budgets.created_at,
                budgets.updated_at
            FROM budgets
            LEFT JOIN categories
                ON categories.id = budgets.category_id
                AND categories.user_id = budgets.user_id
        `)
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
