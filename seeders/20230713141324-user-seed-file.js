'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const users = []
    users.push({
      account: 'buyer001',
      name: 'user1',
      password: 'titaner',
      email: 'user1@example.com',
      cellphone: '0912345678',
      birth: '1994-01-01',
      avatar: '',
      role: 'buyer',
      created_at: new Date(),
      updated_at: new Date()
    })
    users.push({
      account: 'seller001',
      name: 'user2',
      password: 'titaner',
      email: 'user2@example.com',
      cellphone: '0912345678',
      birth: '1994-01-01',
      avatar: '',
      role: 'seller',
      created_at: new Date(),
      updated_at: new Date()
    })
    await queryInterface.bulkInsert('Users', users, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', {})
  }
};
