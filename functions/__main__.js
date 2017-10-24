const reddit = require("../reddit");
const lib = require("lib");

/**
* @returns {any}
*/
module.exports = (context, callback) => {
  reddit
    .getSubreddit("pythonforengineers")
    .getNewComments()
    .then(comments => {
      comments.map(comment => comment.toLowerCase()).map();
    })
    .catch(error => {
      console.error(error);
      return callback(error);
    });
};


// "ACTIONS": {
//   "faas": "I love faas!",
//   "serverless": "I love serverless"
// }
// "ACTIONS": {
//   "faas": "I love faas!",
//   "serverless": "I love serverless"
// }
// "ACTIONS": {
//   "faas": "I love faas!",
//   "serverless": "I love serverless"
// }