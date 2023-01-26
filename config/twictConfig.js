const { Activity } = require('twict');

const twict = new Activity(process.env.TWITTER_ENVIRONMENT_NAME, {
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET_KEY,
  token: process.env.TWITTER_OAUTH_TOKEN_KEY,
  tokenSecret: process.env.TWITTER_OAUTH_TOKEN_SECRET_KEY,
});

module.exports = { twict };
