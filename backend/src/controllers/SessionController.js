const bcrypt = require('bcrypt')
const connection = require('../database/connection')
const GenerateToken = require('../utils/GenerateToken')
const crypto = require('crypto')
const mailer = require('../modules/mailer')

module.exports = {
  async signUp(request, response) {
    const { name, email, password, whatsapp, city, uf } = request.body

    const emailExists = await connection('ongs').where({ email }).first()

    try {
      if (emailExists)
        return response.status(409).send({ error: 'Ong already exists' })

      const hash = await bcrypt.hash(password, 10)

      const ong = {
        name,
        email,
        password: hash,
        whatsapp,
        city,
        uf,
      }

      const [id] = await connection('ongs').insert(ong)

      ong.password = undefined

      return response.status(200).json({ id, ...ong })
    } catch (err) {
      return response
        .status(406)
        .send({ error: 'Registration error! Please, try again' })
    }
  },
  async signIn(request, response) {
    const [, hash] = request.headers.authorization.split(' ')
    const [email, password] = Buffer.from(hash, 'base64').toString().split(':')

    const ong = await connection('ongs').where({ email }).first()

    try {
      if (!ong) return response.status(404).send({ error: 'Ong not found!' })

      const comparePass = await bcrypt.compare(password, ong.password)

      if (!comparePass)
        return response
          .status(401)
          .send({ error: 'Invalid Password, try again!' })

      ong.password = undefined

      const token = GenerateToken(ong.id)

      return response.json({ ...ong, token })
    } catch (err) {
      console.log(err)
      return response
        .status(409)
        .send({ error: 'Authentication error! Please, try again' })
    }
  },

  async passRecover(request, response) {
    const { email } = request.body

    const ong = await connection('ongs').where({ email }).first()

    try {
      if (!ong) return response.status(404).send({ error: 'ong not found' })

      const token = crypto.randomBytes(20).toString('hex')

      const now = new Date()

      now.setHours(now.getHours() + 1)

      await connection('ongs').where('ongs.id', '=', ong.id).update({
        passwordResetToken: token,
        passwordResetExpires: now,
      })

      mailer.sendMail(
        {
          to: email,
          from: process.env.EMAIL_SENDER,
          template: 'auth/forgotPass',
          context: { token },
        },
        (err) => {
          if (err)
            return response
              .status(400)
              .send({ error: 'Cannot send recover email' })

          return response.send({ message: 'Email sent' })
        }
      )
    } catch (err) {
      response.status(400).send({ error: 'Error on forgot password' })
    }
  },
}
