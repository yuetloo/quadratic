'use strict'
const crypto = require('../utils/crypto')
const createError = require('http-errors')

module.exports = {
  requireLogin( req, res, next ) {
    if( !req.auth ) {
      throw new createError(401, 'Require login')
    }
    next();    
  },
  async verify( req, res, next ) {
    if (req.session && req.session.auth) {
      const { counter, data } = req.session.auth
      const token = crypto.decrypt(counter, data)
      req.auth = token
    }
    next();
  }
}
  