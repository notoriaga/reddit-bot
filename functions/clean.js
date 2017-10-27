const reddit = require('../reddit');
const lib = require('lib');

/**
* Removes all comments from the bot with a score below n
* @param {integer} score
* @returns {any}
*/
module.exports = (score, context, callback) => {
  if (
    context.user.username !== context.service.path[0] &&
    context.service.environment !== 'local'
  ) {
    return callback(new Error('You are not allow to access this service'));
  }

  reddit
    .getUser(process.env.REDDIT_USERNAME)
    .getComments()
    .then(comments => {
      let deletePromises = comments
        .filter(comment => comment.score < score)
        .map(comment => {
          return lib[`${context.service.identifier}.delete`](
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
