import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Debts extends BaseSchema {
    protected tableName = 'debts'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')

            table.bigInteger('user_id').notNullable()
            table.bigInteger('debt_user_id').notNullable()
            table.integer('type').notNullable()
            table.string('description').nullable()
            table.integer('price').notNullable()
            table.dateTime('datetime').notNullable()
            table.integer('status').notNullable().defaultTo(0)

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
