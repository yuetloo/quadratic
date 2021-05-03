const db = require('../db')
const User = require('../queries/user')
const Ballot = require('../queries/ballot')

const queryInterface = db.getQueryInterface()

async function main() {
const user = await queryInterface.describeTable('Users');
console.log('user', user);
const ballot = await queryInterface.describeTable('Ballots');
console.log('ballot', ballot);

const users = await User.getTopUsers()
console.log('users', users)

const ballots = await Ballot.get()
console.log('ballots', ballots)
}


main().then(() => console.log('done'))
