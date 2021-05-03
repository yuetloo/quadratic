'use strict'

const User = require('../queries/user');
const { QueryTypes } = require('sequelize')


test('setOptout should work', async () => {
  const username = 'yuetloo'
  await User.setOptout(username)
  const users = await User.searchUsers(username)
  await expect(users.length).toBe(0)
});

test('castVote should work', async () => {
  const candidate = 'gitcoin'
  const score = 6
  await User.castVote({ voter: 'ricmoo', candidate, score})
  const users = await User.searchUsers(candidate)
  expect(users.length).toBe(1)
  expect(users[0].score > 6).toBe(true)
});