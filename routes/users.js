const express = require('express');
const router = express.Router();
const Twitter = require('../utils/twitter')

const leaders = {
  'Anne_Connelly': 10,
  'owocki': 9,
  'ricmoo': 8,
  'vitalikbuterin': 7,
  'elonmusk': 6,
  'jack': 5,
  'sprinklesnft': 4,
  'gitcoin': 3,
  'hi_firefly': 2,
  'yuetloo': 1
}

const addVoteToUsers = (users) => {
  const result = users.map((u, i) => ({
    username: u.username,
    name: u.name,
    profile_image_url: u.profile_image_url,
    description: u.description,
    votes: leaders[u.username]
  }))
  return result;
}

router.get('/', async (req, res, next) => {

  const usernames = Object.keys(leaders).join(',')
  try {
    const twitter = new Twitter()
    const users  = await twitter.getUsers(usernames, "profile_image_url");
    const usersWithVotes = addVoteToUsers(users);
    res.send({ data: usersWithVotes });  
  } catch (e) {
    next(e)
  }
});

router.get('/:username', async (req, res, next) => {
  const { username } = req.params;
  try {
    let data = {};
    const twitter = new Twitter()
    const users  = await twitter.getUsers(username, "name,location,profile_image_url,description");
    if( users.length > 0 )
    {
      data = addVoteToUsers(users)[0];
    }
    res.send({ data });
  } catch (e) {
    next(e)
  }
});

module.exports = router;
