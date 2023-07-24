'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const shops = await queryInterface.sequelize.query('SELECT id FROM Shops', { type: queryInterface.sequelize.QueryTypes.SELECT })
    await queryInterface.bulkInsert('Products', Array.from({ length: 100 }, (_, i) => ({
      name: `product${i+1}`,
      image: `https://picsum.photos/id/${Math.floor(Math.random() * 30)}/300/200`,
      price: 100,
      rest_amount: 5,
      total_amount: 10,
      desc: 'good product',
      status: 'enable',
      shop_id: shops[0].id,
      created_at: new Date(),
      updated_at: new Date()
    })))
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Products', {})
  }
};
