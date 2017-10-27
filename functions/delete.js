const reddit = require('../reddit');

/**
* Remove top level link or comment by id
* @param {string} postID
* @returns {any}
*/
module.exports = (postID, context, callback) => {
  if (
    context.service.environment !== 'local' &&
    context.user.username !== context.service.path[0] 
  ) {
    return callback(new Error('You are not allowed to access this service'));
  }

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
