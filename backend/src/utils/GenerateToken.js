const jwt = require('jsonwebtoken')
const { secret } = require('../configs/auth')

function GenerateToken(id) {
  const token = jwt.sign({ id }, secret, {
    expiresIn: 86400,
  })

  return token
}

module.exports = GenerateToken
