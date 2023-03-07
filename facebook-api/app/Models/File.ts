import { BaseModel, column, computed } from '@ioc:Adonis/Lucid/Orm'
import { FileCategory } from 'App/Utils'
import Env from '@ioc:Adonis/Core/Env'

export default class File extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public fileCategory: FileCategory

  @column()
  public fileName: string

  @column()
  public ownerId: number

  @computed()
  public get url() {
    return `${Env.get('APP_URL')}/uploads/${this.fileName}`
  }
}
