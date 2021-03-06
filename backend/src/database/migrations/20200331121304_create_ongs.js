exports.up = function (knex) {
  return knex.schema.createTable('ongs', function (table) {
    table.increments('id').primary()
    table.string('name').notNullable()
    table.string('email').notNullable()
    table.string('password').notNullable()
    table.string('whatsapp').notNullable()
    table.string('city').notNullable()
    table.string('uf', 2).notNullable()
    table.string('passwordResetToken')
    table.date('passwordResetExpires')
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('ongs')
}
