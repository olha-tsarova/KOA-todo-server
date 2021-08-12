import bcrypt from 'bcrypt'

export const registration = async ctx => {
  try {
    const { request } = ctx
    const newUserData = request.body

    const candidate = await ctx.db.users.findOne({
      where: { login: newUserData.login }
    })

    if (candidate) {
      throw new Error(`User ${newUserData.login} already exists!`)
    }

    if (
      !newUserData.login ||
      !newUserData.name ||
      !newUserData.password ||
      !newUserData.email
    ) {
      throw new Error('Wrong data')
    }

    const hash = await bcrypt.hash(newUserData.password, 2)

    const newUser = {
      login: newUserData.login,
      email: newUserData.email,
      name: newUserData.name,
      password: hash
    }

    await ctx.db.users.create(newUser)
    ctx.body = JSON.stringify('User was created successfully!')
  } catch (e) {
    ctx.status = 400
    ctx.body = e.message
  }
}
