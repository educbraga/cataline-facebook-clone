import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { StoreValidator, UpdateValidator } from 'App/Validators/User/ForgotPassword'
import Mail from '@ioc:Adonis/Addons/Mail'
import { User, UserKey } from 'App/Models'
import { faker } from '@faker-js/faker'

export default class UserForgotPasswordController {
  public async store({ request }: HttpContextContract) {
    const { email, redirectUrl } = await request.validate(StoreValidator)

    const user = await User.findByOrFail('email', email)

    const key = faker.datatype.uuid() + new Date().getTime()

    user.related('keys').create({ key })

    const link = `${redirectUrl.replace(/\/$/, '')}/${key}`

    // envio do email | mailtrap

    await Mail.send((message) => {
      message.to(email)
      message.from('contato@facebook.com', 'Facebook')
      message.subject('Recuperação de conta')
      message.htmlView('emails/forgot-password', { link })
    })
  }

  public async show({ params }: HttpContextContract) {
    // await UserKey.findByOrFail('key', params.key)
    const userKey = await UserKey.findByOrFail('key', params.key)
    const user = await userKey.related('user').query().firstOrFail()

    return user
  }

  public async update({ request, response }: HttpContextContract) {
    const { key, password } = await request.validate(UpdateValidator)

    const userKey = await UserKey.findByOrFail('key', key)

    const user = await userKey.related('user').query().firstOrFail()

    // const username = name.split(' ')[0].toLocaleLowerCase() + new Date().getTime()

    user.merge({ password })

    await user.save()

    await userKey.delete()

    return response.ok({ message: 'password changed successfully' })
  }
}
