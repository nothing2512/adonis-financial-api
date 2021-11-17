import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Transactions extends BaseSchema {
    protected tableName = 'transactions'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')

            table.bigInteger('user_id').notNullable()
            table.bigInteger('category_id').nullable().defaultTo(0)
            table.bigInteger('saving_id').nullable().defaultTo(0)
            table.integer('type').notNullable()
            table.integer('status').notNullable().defaultTo(0)
            table.string('title').notNullable()
            table.text('description')
            table.dateTime('datetime').notNullable()
            table.integer('price').notNullable()
            table.string('attachment').nullable()

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
