'use strict'

const Database = use('Database')
const User = use('App/Models/User')

class UserController {
  async store ({ request, response }) {
    const data = await request.only(['username', 'email', 'password'])
    const addresses = request.input('addresses')

    // Ajustado para fazer rollback na transação e disparar erro em seguida
    const trx = await Database.beginTransaction()
    try {
      const user = await User.create(data, trx)
      await user.addresses().createMany(addresses, trx)
      await trx.commit()
      return user
    } catch (err) {
      await trx.rollback()
      throw err
    }
  }
}

module.exports = UserController
