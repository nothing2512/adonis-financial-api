import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class DebtUsers extends BaseSchema {
    protected tableName = 'debt_users'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')

            table.bigInteger('user_id').notNullable()
            table.string('name').notNullable()
            table.string('phone').notNullable()
            table.string('email').notNullable()
            table.string('address').notNullable()
            table.string('photo').nullable()

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
