import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { StoreValidator, UpdateValidator } from 'App/Validators/Post/Main'
import Application from '@ioc:Adonis/Core/Application'
import { User, Post } from 'App/Models'
import fs from 'fs'

export default class PostsMainController {
  public async index({ request, auth }: HttpContextContract) {
    const { username } = request.qs()

    const user = (await User.findByOrFail('username', username)) || auth.user!

    await user.load('posts', (query) => {
      query.orderBy('id', 'desc')
      query.preload('media')
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

  public async update({ request, response, params, auth }: HttpContextContract) {
    const data = await request.validate(UpdateValidator)
    const post = await Post.findOrFail(params.id)

    if (auth.user!.id !== post.userId) {
      return response.unauthorized()
    }

    await post.merge(data).save()

    return post
  }

  public async destroy({ response, params, auth }: HttpContextContract) {
    const post = await Post.findOrFail(params.id)

    if (auth.user!.id !== post.userId) {
      return response.unauthorized()
    }

    await post.load('media')

    if (post.media) {
      fs.unlinkSync(Application.tmpPath('uploads', post.media.fileName))

      await post.media.delete()
    }

    await post.delete()
  }
}
