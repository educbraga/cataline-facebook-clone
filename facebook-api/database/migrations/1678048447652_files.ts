import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { fileCategories } from 'App/Utils'

export default class extends BaseSchema {
  protected tableName = 'files'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('owner_id').notNullable()
      table.enum('file_category', fileCategories).notNullable()
      table.string('file_name').notNullable()
      

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
