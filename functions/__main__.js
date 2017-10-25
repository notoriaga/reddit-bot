const reddit = require('../reddit');
const lib = require('lib');

const KEYWORDS = ['bot'];
const RESPONSE = `testing 123

  ^This ^bot ^was ^made ^with ^[StdLib](https://stdlib.com) ^^downvote ^^me ^^to ^^remove ^^this ^^comment
`;

/**
* @returns {any}
*/
module.exports = (context, callback) => {
  lib.utils.storage
    .get('commentsRepliedTo')
    .then(comments => {
      return comments || {};
    })
    .then(commentsRepliedTo => {
      reddit
        .getSubreddit('pythonforengineers')
        .getNewComments({ limit: 25 })
        .then(listing => {
          let comments = listing.map(comment => {
            return {
              name: comment.name,
              words: comment.body.toLowerCase().split(' ')
            };
          });

          let validComments = comments.filter(comment => {
            return comment.words.some(word => {
              return (
                KEYWORDS.includes(word) && !(comment.name in commentsRepliedTo)
              );
            });
          });

          let replyPromises = validComments.map(comment => {
            return lib[`${context.service.identifier}.reply`](
              comment.name,
              RESPONSE
            ).then(result => {
              return result;
            });
          });

          return Promise.all(replyPromises).then(results => {
            results.map(result => {
              commentsRepliedTo[result.parent_id] = true;
            });
            lib.utils.storage
              .set('commentsRepliedTo', commentsRepliedTo)
              .then(_results => {
                return callback(null, results);
              });
          });
        })
        .catch(error => {
          return callback(error);
        });
    });
};
