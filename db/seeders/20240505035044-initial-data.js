'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    //Array.from(obj, mapFn, thisArg) 跟 Array.from(obj).map(mapFn, thisArg) 的結果是一樣的
    await queryInterface.bulkInsert("Todos", Array.from({ length: 10 }, (v, i) => 
      ( {
        name: `todo-${ i + 1 }`,
        createdAt: new Date(),
        updatedAt: new Date()
      } )
    ))
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Todos", null)
  }
};
