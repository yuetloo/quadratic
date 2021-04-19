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

const createClient = ({
  bearerToken,
  accessTokenKey,
  accessTokenSecret
} = {}) => (
  bearerToken?
  new TwitterLite({
    version: "2",
    extension: false,
    bearer_token: bearerToken
  }) :
  new TwitterLite({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: accessTokenKey,
  access_token_secret: accessTokenSecret
}))

class Twitter {
  constructor({accessTokenKey, accessTokenSecret} = {}) {
    // this is used for posting tweets
    if( accessTokenKey && accessTokenSecret) {
      this.user = new TwitterLite({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token_key: accessTokenKey,
        access_token_secret: accessTokenSecret
      })
    }
  }

  async getUsers(userList, extraFields) {
    try {
      const client = createClient({
        bearerToken: process.env.TWITTER_BEARER_TOKEN
      })
      const url = 'users/by';
      const usernames = userList.join(',')
      const response = await client.get(url, {
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
      const client = createClient({
        accessTokenKey: process.env.TWITTER_ACCESS_TOKEN_KEY,
        accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET
      })
      const url = 'users/search'
      const response = await client.get(url, { q: username });
      return response.map(u => u.screen_name);

    } catch (e) {
      handleError(e);
    }
  }

  async getRequestToken() {
    let token;
    try {
      const client = createClient()
      const callbackUrl = process.env.TWITTER_CALLBACK_URL
      token = await client.getRequestToken(callbackUrl)
    } catch (e) {
      handleError(e);
    }

    if( !token.oauth_callback_confirmed ) {
      throw new createError(401, 'OAuth error');
    }

    return token;
  }

  async getAccessToken({oauthVerifier, oauthToken}) {

    const client = createClient()

    const token = await client.getAccessToken({
      oauth_verifier: oauthVerifier,
      oauth_token: oauthToken
    })

    return token;
  }

  async verifyCredentials() {

    if (!this.user) throw new Error('User not authenticated')
    const result = await this.user.get("account/verify_credentials");
    return {
      name: result.name,
      username: result.screen_name,
      description: result.description,
      followersCount: result.followers_count,
      profileImage: result.profile_image_url_https
    };
  }

  async postTweet(status) {

    if (!this.user) throw new Error('User not authenticated')

    try {
      const tweet = await this.user.post("statuses/update", {
        status: status
      })
      return tweet.id
    } catch (e) {
      console.log('error tweeting', e);
      handleError(e);
    }
  }
}

module.exports = Twitter;
