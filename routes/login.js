const express = require('express');
const router = express.Router();
const twitter = require('../utils/twitter')
const sessionMiddleware = require('../middleware/session')

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
  const { 
    oauth_verifier: oauthVerifier,
    oauth_token: oauthToken 
  } = req.query;

  try {
    const token = await twitter.getAccessToken({
      oauthVerifier,
      oauthToken
    })

    const username = token.screen_name;
    const oauthSecret = token.oauth_token_secret;

    const auth = sessionMiddleware.encrypt(oauthToken, oauthSecret)
    req.session.auth = auth;
    res.json({ username })

  } catch (err) {
    console.log('callback error', err)  
    next({status: 401, message: err})
  }
})

module.exports = router;
