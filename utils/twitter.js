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

class Twitter {
  constructor() {
    this.client = new TwitterLite({
      version: "2",
      extension: false,
      bearer_token: process.env.TWITTER_TOKEN
    })
    this.clientV1 = new TwitterLite({
      version: "1.1",
      bearer_token: process.env.TWITTER_TOKEN,
      consumer_key: process.env.TWITTER_KEY,
      consumer_secret: process.env.TWITTER_SECRET
    })
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
      return [];

    } catch (e) {
      handleError(e);
    }
  }

}

module.exports = new Twitter();