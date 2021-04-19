'use strict'

require('dotenv').config()

const Sequelize = require('sequelize')
  
module.exports = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl:  { rejectUnauthorized: false }
  }
})
  
