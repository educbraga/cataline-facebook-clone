import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { StoreValidator } from 'App/Validators/User/Register'
import { User } from 'App/Models'
import { faker } from '@faker-js/faker'

export default class UserRegistersController {

  public async store({request}: HttpContextContract) {
    const { email, redirectUrl } = await request.validate(StoreValidator)
    const user = await User.create({ email })

    await user.save()

    const key = user.related('keys').create({key: faker.datatype.uuid() + new Date().getTime() })

    const link = `${redirectUrl.replace(/\/$/, '')}/${key}`

    // envio do email

  }

  public async show({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

}
