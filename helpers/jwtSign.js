import jwt from 'jsonwebtoken'

const jwtSign = user => {
  return jwt.sign({ id: user.id, status: user.status }, process.env.SECRET, {
    expiresIn: '15m'
  })
}

export default jwtSign
