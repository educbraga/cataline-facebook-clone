import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'

export default class UpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    description: schema.string.optional( { trim: true } ),
  })
  
  public messages: CustomMessages = {}
}