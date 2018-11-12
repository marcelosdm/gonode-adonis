'use strict'

const Database = use('Database')
const User = use('App/Models/User')

class UserController {
  async store ({ request }) {
    const data = await request.only(['username', 'email', 'password'])
    const addresses = request.input('addresses')

    // Quando algo falha, a request roda até dar timeout
    const trx = await Database.beginTransaction()
    const user = await User.create(data, trx)
    await user.addresses().createMany(addresses, trx)
    await trx.commit()

    return user
  }
}

module.exports = UserController
