const reddit = require('../reddit');

/**
* Remove top level link or comment by id
* @param {string} authToken
* @param {string} postID
* @returns {any}
*/
module.exports = (authToken, postID, context, callback) => {
  if (authToken !== process.env.AUTH_TOKEN) {
    return callback(new Error('Invalid auth token'));
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
