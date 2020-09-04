const nodemailer = require('nodemailer')
const path = require('path')
const hbs = require('nodemailer-express-handlebars')

const transport = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

transport.use(
  'compile',
  hbs({
    viewEngine: {
      partialsDir: path.resolve('./src/resources/mail'),
      defaultLayout: undefined,
    },
    viewPath: path.resolve('./src/resources/mail'),
    extName: '.html',
  })
)

module.exports = transport
