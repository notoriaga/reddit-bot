const snoowrap = require('snoowrap');

const reddit = new snoowrap({
  userAgent: process.env.REDDIT_USER_AGENT,
  clientId: process.env.REDDIT_KEY,
  clientSecret: process.env.REDDIT_SECRET,
  username: process.env.REDDIT_USERNAME,
  password: process.env.REDDIT_PASSWORD
});

reddit.config({ requestDelay: 100, continueAfterRatelimitError: true });

module.exports = reddit;
