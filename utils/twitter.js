const createError = require('http-errors');
const TwitterLite = require('twitter-lite')

require('dotenv').config()

const handleError = (e) => {
  if ('errors' in e) {
    // Twitter API error
    if (e.errors[0].code === 88)
    {
      // rate limit exceeded
      throw new createError(429, "Rate limit will reset on", new Date(e._headers.get("x-rate-limit-reset") * 1000));
    } 
    else {
      throw new createError(400, e.errors[0].message);
    }
  }
  throw new createError(500, e.message);
}

const getTwitterClient = () => (new TwitterLite({
  version: "1.1",
  consumer_key: process.env.TWITTER_API_KEY,
  consumer_secret: process.env.TWITTER_SECRET
}))

class Twitter {
  constructor() {
    this.client = new TwitterLite({
      version: "2",
      extension: false,
      bearer_token: process.env.TWITTER_TOKEN
    });

    this.clientV1 = new TwitterLite({
      version: "1.1",
      access_token_key: process.env.TWITTER_ACCESS_TOKEN,
      access_token_secret: process.env.TWITTER_ACCESS_SECRET,
      consumer_key: process.env.TWITTER_API_KEY,
      consumer_secret: process.env.TWITTER_SECRET
    });
  }

  async getUsers(usernames, extraFields) {
    try {
      const url = 'users/by';
      const response = await this.client.get(url, {
        usernames,
        "user.fields": extraFields
      });

      return response.data;

    } catch (e) {
      handleError(e);
    }
  }

  async searchUsers(username) {
    try {
      const url = 'users/search'
      const response = await this.clientV1.get(url, { q: username });
      return response.map(u => u.screen_name);

    } catch (e) {
      handleError(e);
    }
  }

  async getRequestToken() {
    let token;
    try {
      token = await getTwitterClient().getRequestToken(process.env.TWITTER_CALLBACK_URL)
    } catch (e) {
      handleError(e);
    }

    if( !token.oauth_callback_confirmed ) {
      throw new createError(401, 'OAuth error');
    }

    return token;
  }

  async getAccessToken({oauthVerifier, oauthToken}) {

    const token = await getTwitterClient().getAccessToken({
      oauth_verifier: oauthVerifier,
      oauth_token: oauthToken
    })

    console.log('token===>', token)
    return token;
  }

}

module.exports = new Twitter();
