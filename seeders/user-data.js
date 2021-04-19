'use strict';

module.exports = {
  up: async (queryInterface) => {
   await queryInterface.bulkInsert('users', [{
     username: 'gitcoin',
     rank: 1,
     credits: 10,
   },{
    username: 'owocki',
    rank: 2,
    credits: 10,
  },{
    username: 'Anne_Connelly',
    rank: 3,
    credits: 10,
  },{
    username: 'VitalikButerin',
    rank: 4,
    credits: 10,
  },{
    username: 'elonmusk',
    rank: 5,
    credits: 10,
  },{
    username: 'jack',
    rank: 6,
    credits: 10,
  },{
    username: 'SprinklesNFT',
    rank: 7,
    credits: 10,
  },{
    username: 'hi_firefly',
    rank: 8,
    credits: 10,
  },{
    username: 'ricmoo',
    rank: 9,
    credits: 10,
  },{
    username: 'yuetloo',
    rank: 10,
    credits: 10,
  },{
    username: 'Loo27464703',
    rank: 11,
    credits: 10,
  }], {})
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('users', null, {})
  }
};
