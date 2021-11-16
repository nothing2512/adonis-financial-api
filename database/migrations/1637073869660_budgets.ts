import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Budgets extends BaseSchema {
    protected tableName = 'budgets'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')

            table.bigInteger('user_id').notNullable()
            table.bigInteger('category_id').nullable()
            table.string('name').notNullable()
            table.integer('total').notNullable().defaultTo(1)
            table.integer('price').notNullable().defaultTo(0)

            /**
             * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
             */
            table.timestamp('created_at', {useTz: true})
            table.timestamp('updated_at', {useTz: true})
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
