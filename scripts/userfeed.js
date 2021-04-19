const { query } = require('express');
const db = require('../db')

async function main() {
  const queryInterface = db.getQueryInterface()
  await queryInterface.bulkInsert('Users', [{
     username: 'gitcoin',
     rank: 1,
     credits: 10,
     credits: 0,
     votes: 0,
     optout: false
   },{
    username: 'owocki',
    rank: 2,
    credits: 10,
    credits: 0,
    votes: 0,
    optout: false
 },{
    username: 'Anne_Connelly',
    rank: 3,
    credits: 10,
    credits: 0,
    votes: 0,
    optout: false
 },{
    username: 'VitalikButerin',
    rank: 4,
    credits: 10,
    credits: 0,
    votes: 0,
    optout: false
 },{
    username: 'elonmusk',
    rank: 5,
    credits: 10,
    credits: 0,
    votes: 0,
    optout: false
 },{
    username: 'jack',
    rank: 6,
    credits: 10,
    credits: 0,
    votes: 0,
    optout: false
 },{
    username: 'SprinklesNFT',
    rank: 7,
    credits: 10,
    credits: 0,
    votes: 0,
    optout: false
 },{
    username: 'hi_firefly',
    rank: 8,
    credits: 10,
    credits: 0,
    votes: 0,
    optout: false
 },{
    username: 'ricmoo',
    rank: 9,
    credits: 10,
    credits: 0,
    votes: 0,
    optout: false
 },{
    username: 'yuetloo',
    rank: 10,
    credits: 10,
    credits: 0,
    votes: 0,
    optout: false
 },{
    username: 'Loo27464703',
    rank: 11,
    credits: 10,
    credits: 0,
    votes: 0,
    optout: false
 }], {})
}

main().then(() => {
  console.log('done user data')
}).catch(e => {
  console.log('error feeding user data', e)
}).finally(() => {
  db.close()
})
