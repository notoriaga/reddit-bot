const reddit = require("../reddit");

/**
* Returns comment tree of a thread
* @param {string} thread
* @param {number} limit Max number of comments to return at each depth (default inf)
* @param {number} depth Max depth of subtrees in thread (default inf)
* @returns {any}
*/
module.exports = (thread, limit = 0, depth = 0, context, callback) => {
  reddit
    .getSubmission(thread)
    .expandReplies({
      limit: limit || Infinity,
      depth: depth || Infinity
    })
    .then(results => {
      return callback(null, results.comments);
    })
    .catch(error => {
      console.error(error);
      return callback(error);
    });
};
