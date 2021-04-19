'use strict'

const { DataTypes } = require('sequelize')
const db = require('../db')

require('../models/user')(db, DataTypes)
const { User } = db.models

const attributes = ["username", "rank", "credits", "votes", "optout"]

module.exports = {
  getUserByUsername: async username => {
    const user = await User.findOne({
      attributes,
      where: { username }
    })
    return user?.dataValues
  },
  getTopUsers: async ({offset, limit} = {}) => {
    const data = await User.findAll({
      attributes,
      limit: limit || 10,
      offset: offset || 0,
      order: ['rank']
    })
    return data.map(u => u.dataValues)
  }
}