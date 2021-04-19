const { query } = require('express');
const db = require('../db')

async function main() {
  const queryInterface = db.getQueryInterface()
  await queryInterface.dropTable('votes');
  await queryInterface.dropTable('users');
  await queryInterface.dropTable('iotes');
  await queryInterface.dropTable('UserVotes');
  /*
  await queryInterface.removeIndex('vote_username_index')
  await queryInterface.removeIndex('vote_votedBy_index')
  await queryInterface.removeIndex('user_username_index')
  await queryInterface.removeIndex('user_rank_index')
  await queryInterface.removeIndex('user_optout_index')
  */
}

main().then(() => {
  console.log('done dropping tables')
}).catch(e => {
  console.log('error dropping tables', e)
}).finally(() => {
  db.close()
})
