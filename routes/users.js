const express = require('express');
const router = express.Router();
const Twitter = require('../utils/twitter')
const Query = require('../queries')


router.get('/', async (req, res, next) => {

  const { offset = 0, limit } = req.query

  let data = []
  let total
  try {
    // twitter only accepts searching 100 users at a time
    if ( limit && limit >= 100 ) throw new Error('Limit must be less than 100')

    const users = await Query.getTopUsers({offset, limit})
    if( users.length > 0 ) {
      const usernames = users.map(u => u.username)

      const twitter = new Twitter()
      const twitterUsers  = await twitter.getUsers(usernames, "name,profile_image_url,description");
      data = users.map(u => {
        const twitterUser = twitterUsers.find(v => v.username === u.username)
        return { ...u, ...twitterUser }
      })
    }

    if( offset == 0 )
    {
      // provide a count for the first batch
      total = await Query.userCount()
    }

    res.send({ users: data, total });
  } catch (e) {
    next(e)
  }
});

router.get('/:username', async (req, res, next) => {
  const { username } = req.params;
  try {
    let data = {}
    const twitter = new Twitter()
    const result  = await twitter.getUsers([username], "name,location,profile_image_url,description");
    const twitterUser = result?.[0]
    if( twitterUser )
    {
      const user = await Query.getUserByUsername(twitterUser.username) || {}
      data = {
        ...user,
        ...twitterUser
      }
    }

    res.send({ data });

  } catch (e) {
    next(e)
  }
});

module.exports = router;
