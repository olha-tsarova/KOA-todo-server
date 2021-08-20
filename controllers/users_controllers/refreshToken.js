import jwt from 'jsonwebtoken'
import { v4 as uuid } from 'uuid'

export const refreshToken = async ctx => {
  try {
    const { query } = ctx

    const token = await ctx.db.tokens.findOne({
      where: { token: query.oldToken }
    })

    console.log('OLD TOKEN _________>', query.oldToken)
    if (!token) {
      throw new Error('Token is invalid')
    }

    const user = await ctx.db.users.findOne({ where: { id: token.userId } })
    console.log('USER ID BY TOKEN ------->', user)
    token.destroy()

    const newToken = jwt.sign(
      { id: user.id, status: user.status },
      process.env.SECRET,
      { expiresIn: '15m' }
    )

    const refreshToken = uuid()

    await ctx.db.tokens.create({
      userId: user.id,
      token: refreshToken
    })

    ctx.body = {
      tokens: {
        accessToken: newToken,
        refreshToken
      },
      user
    }
  } catch (e) {
    ctx.status = 400
    ctx.body = e.message
  }
}
