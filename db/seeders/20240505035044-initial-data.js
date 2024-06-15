'use strict'
const bcrypt = require('bcryptjs')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const hash = await bcrypt.hash('123456', 10)

    let t

    try {
      t = await queryInterface.sequelize.transaction()

      await queryInterface.bulkInsert('Users', [{
        id: 1,
        name: 'root',
        email: 'test@example.com',
        password: hash,
        createdAt: new Date(),
        updatedAt: new Date()
      }], { transaction: t })

      // Array.from(obj, mapFn, thisArg) 跟 Array.from(obj).map(mapFn, thisArg) 的結果是一樣的
      await queryInterface.bulkInsert('Todos', Array.from({ length: 10 }, (v, i) =>
        ({
          name: `todo-${i + 1}`,
          userID: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        })
      ), { transaction: t })

      await t.commit()
    } catch (error) {
      await t.rollback()
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null)
  }
}
