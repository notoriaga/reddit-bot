const reddit = require('../reddit');
const lib = require('lib');

/**
* Removes all comments from the bot with a score below n
* @param {string} authToken
* @param {integer} score
* @returns {any}
*/
module.exports = (authToken, score, context, callback) => {
  if (authToken !== process.env.AUTH_TOKEN) {
    return callback(new Error('Invalid auth token'));
  }

  reddit
    .getUser(process.env.REDDIT_USERNAME)
    .getComments()
    .then(comments => {
      let deletePromises = comments
        .filter(comment => comment.score < score)
        .map(comment => {
          return lib[`${context.service.identifier}.delete`](
            authToken,
            comment.name
          ).then(result => {
            return result;
          });
        });

      Promise.all(deletePromises).then(results => {
        return callback(null, results);
      });
    })
    .catch(error => {
      return callback(error);
    });
};
