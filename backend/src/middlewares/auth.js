const jwt = require('jsonwebtoken')
const { secret } = require('../configs/auth.json')

module.exports = (request, response, next) => {
  const authHeader = request.headers.authorization

  if (!authHeader)
    return response.status(481).send({ error: 'No token provided' })

  const parts = authHeader.split(' ')

  if (!parts.length === 2)
    return response.status(481).send({ error: 'Token error' })

  const [scheme, token] = parts

  if (!/^Bearer$/i.test(scheme))
    return response.status(481).send({ error: 'Token malformated' })

  jwt.verify(token, secret, (err, decoded) => {
    if (err) return response.status(481).send({ error: 'Invalid Token' })

    request.userID = decoded.id
  })

  return next()
}
