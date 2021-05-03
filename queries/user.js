'use strict'

const Twitter = require('../utils/twitter')
const { QueryTypes, DataTypes, Op } = require('sequelize')
const db = require('../db')

require('../models/user')(db, DataTypes)
const { User } = db.models
const Ballot = require('./ballot')


const userQuery = ({limit = 10, offset = 0, userSearch}) => {
  const AndFilterUser = userSearch? "AND u.username ILIKE '%" + userSearch + "%'" : ''
  return `
    SELECT u.username,
          u.score,
          (SELECT COUNT(1) + 1 FROM "Users" uu
            WHERE uu.score > u.score) as rank,
          (SELECT SUM(b.score * b.score) FROM "Ballots" b
            WHERE b.voter = u.username) as "creditsUsed"
      FROM "Users" u
    WHERE u.optout = false ${AndFilterUser}
    ORDER BY score DESC
    LIMIT ${limit}
    OFFSET ${offset}
`
}

const updateUserScore = async (username, transaction ) => {
  const score = await Ballot.sumScore(username, transaction)
  return User.update({ score }, {
    where: { username },
    transaction
  })
}

const adjustCandidateScore = async ({ voter, transaction}) => {
  const candidates = await Ballot.getCandidates(voter, transaction)

  for (let candidate of candidates) {
    await updateUserScore(candidate, transaction)
  }
}

module.exports = {
  getTopUsers: async ({offset = 0, limit = 10} = {}) => {
    const users = await db.query(userQuery({offset, limit}),
    {
      type: QueryTypes.SELECT
    })

    const twitter = new Twitter()
    return twitter.getUserProfiles(users)
  },
  count: async () => {
    const data = await User.count({
      where: {
        optout: false
      },
      raw: true
    })

    return data
  },
  searchUsers: async (userSearch, limit = 10) => {
    const users = await db.query(userQuery({limit, userSearch}),
    {
      type: QueryTypes.SELECT
    })

    const twitter = new Twitter()
    return twitter.getUserProfiles(users)
  },
  filterOptout: async (users) => {
    const usernames = users.map(u => u.username)
    const result = await User.findAll({
      attributes: [ "username" ],
      where: {
        optout: true,
        username: usernames
      },
      raw: true
    })
    const optoutUsers = new Set(result)
    return users.filter(u => !optoutUsers.has(u.username))
  },
  castVote: async ({voter, candidate, score}) => {
    const transaction = await db.sequelize.transaction();
    try {
      await Ballot.save({ voter, candidate, score, transaction })
      await updateUserScore(candidate, transaction)
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
    }
  },
  setOptout: async (username) => {
    if(!username) return

    const transaction = await db.sequelize.transaction();
    const now = new Date()
    const voter = username

    try {
      await User.update({ optout: true, updatedat: now }, {
        where: {
          username
        },
        transaction
      })

      await Ballot.destroy({
        where: {
          [Op.or]: {
            voter,
            recipient: username
          }
        },
        transaction
      })

      await adjustCandidateScore({voter, transaction})

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
    }
  }
}