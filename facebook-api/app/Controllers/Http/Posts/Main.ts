import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { StoreValidator, UpdateValidator } from 'App/Validators/Post/Main'
import { User, Post } from 'App/Models'

export default class PostsMainController {
  public async index({ request, auth }: HttpContextContract) {
    const { username } = request.qs()

    const user = (await User.findByOrFail('username', username)) || auth.user!

    await user.load('posts', (query) => {
      query.preload('user', (query) => {
        query.select(['id', 'name', 'username'])
        query.preload('avatar')
      })
    })
    
    return user. posts
  }

  public async store({ request, auth }: HttpContextContract) {
    const data = await request.validate(StoreValidator)
    const post = await auth.user!.related('posts').create(data)
    
    return post 
  }

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
