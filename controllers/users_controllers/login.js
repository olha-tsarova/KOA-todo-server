import bcrypt from 'bcrypt'
import { v4 as uuid } from 'uuid'
import { userConnected } from '../../constants/socketEvents'
import jwtSign from '../../helpers/jwtSign'

export const login = async ctx => {
  try {
    const { request } = ctx
    const { login, password } = request.body

    const user = await ctx.db.users.findOne({ where: { login: login } })
    if (!user) {
      throw new Error(`User ${login} not found!`)
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password)
    if (!isPasswordValid) {
      throw new Error('Wrong login or password')
    }

    if (user.status === 0) {
      throw new Error(`User ${login} is blocked`)
    }

    const accessToken = jwtSign(user)
    const refreshToken = uuid()

    await ctx.db.tokens.create({
      userId: user.id,
      token: refreshToken
    })

    ctx.body = {
      tokens: {
        accessToken,
        refreshToken
      },
      user: {
        id: user.id,
        login: user.login,
        email: user.email,
        role: user.role
      }
    }

    if (ctx.io) {
      ctx.io.emit(userConnected, { userId: user.id })
    }
  } catch (e) {
    ctx.status = 400
    ctx.body = e.message
  }
}
