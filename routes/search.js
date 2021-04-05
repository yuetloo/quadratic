const express = require('express');
const router = express.Router();
const twitter = require('../utils/twitter')

router.get('/', async (req, res, next) => {
    const { username } = req.params;
    try {
      const users  = await twitter.searchUsers(username);
      
      res.send({ data: users });
    } catch (e) {
      next(e)
    }
  });
  
module.exports = router;