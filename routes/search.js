const express = require('express');
const router = express.Router();
const Twitter = require('../utils/twitter')
const User = require('../queries/user')

router.get('/:username', async (req, res, next) => {
    const { username = '' } = req.params;
    const { limit = 10 } = req.query

    try {
      const twitter = new Twitter()
      const users = await User.searchUsers(username, limit)

      let page = 0
      while( users.length < limit ){
        const twitterUsers = await twitter.searchUsers(username, {
          count: limit - users.length,
          page: page++ })
        const filtered = await User.filterOptout(twitterUsers)
        users.push(...filtered)
      }
      
      const data = await twitter.getUserProfiles(users)
      res.send({ data });
    } catch (e) {
      next(e)
    }
  });
  
module.exports = router;