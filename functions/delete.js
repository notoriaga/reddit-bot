const reddit = require('../reddit');

/**
* @acl
*   user__username steve allow 
* Remove top level link or comment by id
* @param {string} postID
* @returns {any}
*/
module.exports = (postID, context, callback) => {
  if (postID.startsWith('t1_')) {
    reddit
      .getComment(postID)
      .delete()
      .then(result => {
        return callback(null, result);
      })
      .catch(error => {
        console.error(error);
        return callback(error);
      });
  } else {
    reddit
      .getSubmission(postID)
      .delete()
      .then(result => {
        return callback(null, result);
      })
      .catch(error => {
        console.error(error);
        return callback(error);
      });
  }
};
