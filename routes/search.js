const express = require('express');
const router = express.Router();
const Twitter = require('../utils/twitter')

router.get('/:username', async (req, res, next) => {
    const { username } = req.params;
    try {
      const twitter = new Twitter()
      const users  = await twitter.searchUsers(username);
      
      res.send({ data: users });
    } catch (e) {
      next(e)
    }
  });
  
module.exports = router;