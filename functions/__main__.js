const Snoocore = require('snoocore');

const reddit = new Snoocore({
  userAgent: '/u/notoriaga test-bot@1.0.0', // unique string identifying the app
  oauth: {
    type: 'script',
    key: process.env.REDDIT_KEY, // OAuth client key (provided at reddit app)
    secret: process.env.REDDIT_SECRET, // OAuth secret (provided at reddit app)
    username: process.env.REDDIT_USERNAME, // Reddit username used to make the reddit app
    password: process.env.REDDIT_PASSWORD, // Reddit password for the username
    // The OAuth scopes that we need to make the calls that we
    // want. The reddit documentation will specify which scope
    // is needed for evey call
    scope: [ 'identity', 'read', 'vote' ]
  }
});

/**
* @returns {any}
*/
module.exports = (context, callback) => {

  reddit('/api/v1/me').get().then(function(result) {

    console.log('/u/' + result.name);
    return reddit('/r/askreddit/hot').listing();

  }).then(function(slice) {

    return slice.next();

  }).then(function(slice) {

    var firstSubmission = slice.children[0];

    console.log('upvoting post:');
    console.log(firstSubmission.data.title);
    console.log(firstSubmission.data.url);

    return reddit('/api/vote').post({
      dir: 1,
      id: firstSubmission.kind + '_' + firstSubmission.data.id
    });

  }).then(function() {

    console.log('done');
    return callback(null);

  });

};
