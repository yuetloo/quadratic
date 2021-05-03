'use strict'
const { DataTypes, QueryTypes } = require('sequelize')
const db = require('../db')

require('../models/ballot')(db, DataTypes)
const { Ballot } = db.models

const attributes = ["voter", "candidate", "score"]

const buildFilter = async ({ voter, candidate }) => {
  const filter = { }
  if( voter ) filter.voter = voter
  if( candidate ) filter.candidate = candidate
  return filter
}

module.exports = {
  count: async (args) => {  
    const filter = await buildFilter(args)

    const count = await Ballot.count({
      where: filter
    })

    return count
  },
  get: async ({voter, candidate, limit, offset = 0} = {}) => {
    const filter = await buildFilter({voter, candidate})

    const result = await Ballot.findAll({
      attributes,
      where: filter,  
      offset,
      limit
    })

    return result
  },
  save: ({voter, candidate, score, transaction}) => {
    return Ballot.create({voter, candidate, score}, { transaction })
  },
  getCandidates: (voter, transaction) => {
    return Ballot.aggregate('candidate', 'DISTINCT', {
      where: { voter },
      transaction
    })
  },
  sumScore: async (candidate, transaction) => {
    const score = await Ballot.sum('score', {
      where: { candidate },
      transaction
    })
    return score
  },
  getCreditsUsed: async (voter) => {
    const ballots = await this.get({voter})
    const credits = ballots
                      .map(b => b.score * b.score)
                      .reduce((res, credits) => res + credits, 0)
    return credits
  }
}