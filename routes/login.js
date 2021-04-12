const express = require('express');
const router = express.Router();
const twitter = require('../utils/twitter')

/* login */
router.get('/', async (req, res, next) => {

  try {
    const {oauth_token} = await twitter.getRequestToken()
    res.redirect(`https://api.twitter.com/oauth/authenticate?oauth_token=${oauth_token}`)
  }
  catch(err) {
    console.log('errr', err)  
    next(err)
  }
});

router.get('/callback', async (req, res, next) => {
  const { oauth_verifier, oauth_token } = req.query;

  try {
    const token = await twitter.getAccessToken({
      oauthVerifier: oauth_verifier,
      oauthToken: oauth_token
    })
    res.json({ username: token.user_id, screenName: token.screen_name })

  } catch (err) {
    console.log('callback error', err)  
    next({status: 401, message: err})
  }
})

module.exports = router;
