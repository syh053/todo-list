'use strict'

const { sequelize } = require('../models')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Todos', 'userID', {
      type: Sequelize.INTEGER,
      allowNull: false
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Todos', 'userID', {
      type: Sequelize.INTEGER,
      allowNull: true
    })
  }
}
