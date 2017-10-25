const reddit = require('../reddit');

/**
* Returns first n post of subreddit
* @param {string} subreddit
* @param {string} sorting Sorted by [hot, new, top]
* @returns {any}
*/
module.exports = (subreddit, sorting = 'hot', context, callback) => {
  switch (sorting) {
    case 'hot':
      reddit
        .getSubreddit(subreddit)
        .getHot()
        .then(results => {
          return callback(null, results);
        })
        .catch(error => {
          console.error(error);
          return callback(error);
        });
      break;
    case 'new':
      reddit
        .getSubreddit(subreddit)
        .getNew()
        .then(results => {
          return callback(null, results);
        })
        .catch(error => {
          console.error(error);
          return callback(error);
        });
      break;
    case 'top':
      reddit
        .getSubreddit(subreddit)
        .getTop()
        .then(results => {
          return callback(null, results);
        })
        .catch(error => {
          console.error(error);
          return callback(error);
        });
      break;
    default:
      return callback(new Error('Not a valid sorting'));
  }
};
