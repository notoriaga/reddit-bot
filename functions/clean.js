const reddit = require("../reddit");
const lib = require("lib");

/**
* Removes all comments from the bot with a score below n
* @param {integer} n
* @returns {any}
*/
module.exports = (n, context, callback) => {
  reddit
    .getUser(process.env.REDDIT_USERNAME)
    .getComments()
    .then(comments => {
      let promises = comments
        .filter(comment => comment.score < n)
        .map(comment => {
          return lib[`${context.service.identifier}.delete`](
            comment.name
          ).then(result => {
            return result;
          });
        });

      Promise.all(promises).then(results => {
        return callback(null, results);
      });
    })
    .catch(error => {
      console.error(error);
      return callback(error);
    });
};
