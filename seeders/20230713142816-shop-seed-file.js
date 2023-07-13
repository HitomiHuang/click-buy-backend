'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const shops = []
    const sellers = await queryInterface.sequelize.query('SELECT id FROM Users WHERE role = :role', { replacements: { role: 'seller' }, type: queryInterface.sequelize.QueryTypes.SELECT })
    shops.push({
      name: 'shop001',
      logo: '',
      desc: 'this is the best shop',
      user_id: sellers[0].id,
      created_at: new Date(),
      updated_at: new Date()
    })
    await queryInterface.bulkInsert('Shops', shops, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Shops', {})
  }
};
