const express = require('express');
const router = express.Router();
const Twitter = require('../utils/twitter')
const crypto = require('../utils/crypto')

/* login */
router.get('/', async (req, res, next) => {

  try {
    const twitter = new Twitter()
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
    if( !oauthVerifier || !oauthToken ) throw new Error('Missing oauth token')

    const twitter = new Twitter()
    const token = await twitter.getAccessToken({
      oauthVerifier,
      oauthToken
    })

    const username = token.screen_name;
    const oauthSecret = token.oauth_token_secret;
    console.log('token from getAccessToken', token)

    const auth = crypto.encrypt(oauthToken, oauthSecret)
    req.session.auth = auth;
    res.json({ username })

  } catch (err) {
    console.log('callback error', err)  
    next({status: 401, message: err.message})
  }
})

module.exports = router;
