'use strict'

const express = require('express');
const router = express.Router();
const twitter = require('../utils/twitter')
const { requireLogin } = require('../middleware/session')

// tweet
router.post('/', requireLogin, async (req, res, next) => {
  const { tokenKey, tokenSecret } = req.auth
  const status = req.body.message || 'hello world!!'

  try {
    const tweet = await twitter.postTweet({ tokenKey, tokenSecret, status })
    console.log('result', tweet)
    res.send({ success: true })
  } catch (e) {
    next(e)
  }
})

module.exports = router;
