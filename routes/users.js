const express = require('express');
const router = express.Router();
const Twitter = require('../utils/twitter')
const Query = require('../queries')


router.get('/', async (req, res, next) => {

  const { offset, limit } = req.query

  try {
    // twitter only accepts searching 100 users at a time
    if ( limit && limit >= 100 ) throw new Error('Limit must be less than 100')

    const users = await Query.getTopUsers({offset, limit})
    const usernames = users.map(u => u.username)

    const twitter = new Twitter()
    const twitterUsers  = await twitter.getUsers(usernames, "name,profile_image_url,description");
    const data = users.map(u => {
      const twitterUser = twitterUsers.find(v => v.username === u.username)
      return { ...u, ...twitterUser }
    })

    res.send({ data });
  } catch (e) {
    next(e)
  }
});

router.get('/:username', async (req, res, next) => {
  const { username } = req.params;
  try {
    const twitter = new Twitter()
    const twitterUsers  = await twitter.getUsers([username], "name,location,profile_image_url,description");
    const user = await Query.getUserByUsername(twitterUsers.map(u => u.username))
    const data = twitterUsers.map(tuser => {
      return {
        ...tuser,
        ...user
      }
    })
    res.send({ data });
  } catch (e) {
    next(e)
  }
});

module.exports = router;
