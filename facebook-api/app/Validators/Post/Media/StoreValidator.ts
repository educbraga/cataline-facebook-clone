import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'

export default class StoreValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    file: schema.file({
      size: '500mb',
      extnames: ['jpg', 'png', 'jpeg', 'mp4', 'mov'],
    })
  })

  public messages: CustomMessages = {}
}
