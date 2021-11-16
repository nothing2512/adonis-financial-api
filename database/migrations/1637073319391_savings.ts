import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Savings extends BaseSchema {
    protected tableName = 'savings'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')

            table.bigInteger('user_id').notNullable()
            table.string('name', 50).notNullable()
            table.integer('balance').notNullable()

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
