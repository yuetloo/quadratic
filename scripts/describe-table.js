const db = require('../db')

const queryInterface = db.getQueryInterface()

async function main() {
const user = await queryInterface.describeTable('users');
console.log('user', user);
const votes = await queryInterface.describeTable('votes');
console.log('votes', votes);
}


main().then(() => console.log('done'))
