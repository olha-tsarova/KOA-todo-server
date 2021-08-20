export default createJwtSign = user => {
  const accessToken = jwt.sign(
    { id: user.id, status: user.status },
    process.env.SECRET,
    { expiresIn: '15m' }
  )

  return accessToken
}
